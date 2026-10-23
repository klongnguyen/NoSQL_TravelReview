using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Configuration;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace Backend.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserProfileDto?> GetProfileAsync(string userId);
}

public class AuthService : IAuthService
{
    private readonly MongoDbContext _context;
    private readonly JwtSettings _jwtSettings;

    public AuthService(MongoDbContext context, IOptions<JwtSettings> jwtOptions)
    {
        _context = context;
        _jwtSettings = jwtOptions.Value;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existing = await _context.Users.Find(u => u.Email == request.Email.Trim().ToLowerInvariant()).FirstOrDefaultAsync();
        if (existing != null)
        {
            throw new InvalidOperationException("Email này đã được sử dụng trên hệ thống");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var newUser = new User
        {
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = passwordHash,
            FullName = request.FullName.Trim(),
            Role = "Member",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Users.InsertOneAsync(newUser);
        var token = GenerateJwtToken(newUser);

        return new AuthResponse
        {
            Token = token,
            UserId = newUser.Id,
            Email = newUser.Email,
            FullName = newUser.FullName,
            Role = newUser.Role,
            AvatarUrl = newUser.AvatarUrl
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.Find(u => u.Email == request.Email.Trim().ToLowerInvariant()).FirstOrDefaultAsync();
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không chính xác");
        }

        var token = GenerateJwtToken(user);
        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            AvatarUrl = user.AvatarUrl
        };
    }

    public async Task<UserProfileDto?> GetProfileAsync(string userId)
    {
        var user = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) return null;

        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwtSettings.ExpiryDays),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
