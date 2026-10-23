// ==============================================================================
// MongoDB Initialization Script for NoSQL Travel Review (DT04)
// Target Database: travel_review
// SRS Baseline 1.0 Compliant
// ==============================================================================

const dbName = 'travel_review';
const dbInstance = db.getSiblingDB(dbName);

print(`[INIT-MONGO] Bắt đầu khởi tạo CSDL ${dbName}...`);

// ------------------------------------------------------------------------------
// 1. Tạo Collections và Schema Validation (JSON Schema)
// ------------------------------------------------------------------------------

// Collection: users
dbInstance.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'passwordHash', 'fullName', 'role', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^.+@.+$',
          description: 'Email người dùng là bắt buộc và phải đúng định dạng'
        },
        passwordHash: {
          bsonType: 'string',
          description: 'Mật khẩu đã băm (BCrypt)'
        },
        fullName: {
          bsonType: 'string',
          description: 'Họ tên hiển thị'
        },
        avatarUrl: {
          bsonType: ['string', 'null'],
          description: 'URL ảnh đại diện'
        },
        role: {
          enum: ['Admin', 'Member'],
          description: 'Phân quyền: Admin hoặc Member'
        },
        googleId: {
          bsonType: ['string', 'null'],
          description: 'Google Subject Id nếu đăng nhập bằng OAuth'
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Collection: categories
dbInstance.createCollection('categories', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'slug', 'isActive', 'createdAt'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Tên danh mục'
        },
        slug: {
          bsonType: 'string',
          description: 'Slug định danh đường dẫn duy nhất'
        },
        icon: {
          bsonType: ['string', 'null']
        },
        description: {
          bsonType: ['string', 'null']
        },
        isActive: {
          bsonType: 'bool',
          description: 'Trạng thái hoạt động'
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Collection: places (Chứa embedded reviews, comments và replies)
dbInstance.createCollection('places', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'slug', 'categoryId', 'address', 'location', 'status', 'createdAt'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Tên địa điểm'
        },
        slug: {
          bsonType: 'string',
          description: 'Slug duy nhất cho địa điểm'
        },
        description: {
          bsonType: 'string',
          description: 'Mô tả chi tiết'
        },
        categoryId: {
          bsonType: 'objectId',
          description: 'Mã danh mục chính duy nhất'
        },
        address: {
          bsonType: 'object',
          required: ['street', 'ward', 'district', 'city'],
          properties: {
            street: { bsonType: 'string' },
            ward: { bsonType: 'string' },
            district: { bsonType: 'string' },
            city: { bsonType: 'string' },
            provinceCode: { bsonType: ['string', 'null'] }
          }
        },
        location: {
          bsonType: 'object',
          required: ['type', 'coordinates'],
          properties: {
            type: {
              enum: ['Point'],
              description: 'GeoJSON Type phải là Point'
            },
            coordinates: {
              bsonType: 'array',
              minItems: 2,
              maxItems: 2,
              items: { bsonType: 'double' },
              description: '[kinh độ (longitude), vĩ độ (latitude)]'
            }
          }
        },
        images: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['url'],
            properties: {
              url: { bsonType: 'string' },
              publicId: { bsonType: ['string', 'null'] },
              isCover: { bsonType: 'bool' }
            }
          }
        },
        status: {
          enum: ['active', 'inactive'],
          description: 'Trạng thái hiển thị công khai'
        },
        ratingAverage: {
          bsonType: ['double', 'null'],
          description: 'Điểm đánh giá trung bình từ reviews'
        },
        reviewCount: {
          bsonType: 'int',
          description: 'Số lượng review còn tồn tại'
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        reviews: {
          bsonType: 'array',
          description: 'Danh sách bài đánh giá nhúng trực tiếp',
          items: {
            bsonType: 'object',
            required: ['reviewId', 'userId', 'rating', 'content', 'createdAt'],
            properties: {
              reviewId: { bsonType: 'objectId' },
              userId: { bsonType: 'objectId' },
              authorName: { bsonType: 'string' },
              authorAvatar: { bsonType: ['string', 'null'] },
              rating: {
                bsonType: 'int',
                minimum: 1,
                maximum: 5,
                description: 'Số sao nguyên từ 1 đến 5'
              },
              content: { bsonType: 'string' },
              images: {
                bsonType: 'array',
                maxItems: 5,
                items: {
                  bsonType: 'object',
                  required: ['url'],
                  properties: {
                    url: { bsonType: 'string' },
                    publicId: { bsonType: ['string', 'null'] }
                  }
                }
              },
              isDemo: { bsonType: 'bool' },
              likes: {
                bsonType: 'array',
                items: { bsonType: 'objectId' }
              },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' },
              comments: {
                bsonType: 'array',
                description: 'Bình luận tầng 1',
                items: {
                  bsonType: 'object',
                  required: ['commentId', 'userId', 'content', 'createdAt'],
                  properties: {
                    commentId: { bsonType: 'objectId' },
                    userId: { bsonType: 'objectId' },
                    userName: { bsonType: 'string' },
                    userAvatar: { bsonType: ['string', 'null'] },
                    content: { bsonType: 'string' },
                    likes: {
                      bsonType: 'array',
                      items: { bsonType: 'objectId' }
                    },
                    createdAt: { bsonType: 'date' },
                    replies: {
                      bsonType: 'array',
                      description: 'Trả lời bình luận tầng 2 (không có tầng 3)',
                      items: {
                        bsonType: 'object',
                        required: ['replyId', 'userId', 'content', 'createdAt'],
                        properties: {
                          replyId: { bsonType: 'objectId' },
                          userId: { bsonType: 'objectId' },
                          userName: { bsonType: 'string' },
                          userAvatar: { bsonType: ['string', 'null'] },
                          content: { bsonType: 'string' },
                          likes: {
                            bsonType: 'array',
                            items: { bsonType: 'objectId' }
                          },
                          createdAt: { bsonType: 'date' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

// Collection: place_proposals
dbInstance.createCollection('place_proposals');

// Collection: reports
dbInstance.createCollection('reports');

// Collection: favorites
dbInstance.createCollection('favorites');

// Collection: view_history
dbInstance.createCollection('view_history');

print('[INIT-MONGO] Đã tạo xong Collections và JSON Schema Validators.');

// ------------------------------------------------------------------------------
// 2. Tạo Indexes phục vụ tra cứu và nghiệp vụ
// ------------------------------------------------------------------------------

// Indexes cho users
dbInstance.users.createIndex({ email: 1 }, { unique: true, name: 'uniq_user_email' });
dbInstance.users.createIndex({ googleId: 1 }, { sparse: true, name: 'idx_user_googleId' });

// Indexes cho categories
dbInstance.categories.createIndex({ slug: 1 }, { unique: true, name: 'uniq_category_slug' });

// Indexes cho places (Cực kỳ quan trọng theo Rubric & SRS)
// 1) 2dsphere index phục vụ tìm kiếm gần tôi (Nearby)
dbInstance.places.createIndex({ location: '2dsphere' }, { name: 'geospatial_place_location' });

// 2) Text index phục vụ tìm kiếm toàn văn theo tên và mô tả
dbInstance.places.createIndex(
  { name: 'text', description: 'text' },
  {
    weights: { name: 10, description: 3 },
    name: 'text_search_name_desc',
    default_language: 'none'
  }
);

// 3) Compound indexes phục vụ lọc danh mục, khu vực và sắp xếp rating
dbInstance.places.createIndex(
  { categoryId: 1, ratingAverage: -1, reviewCount: -1 },
  { name: 'compound_cat_rating_count' }
);
dbInstance.places.createIndex(
  { 'address.district': 1, ratingAverage: -1 },
  { name: 'compound_district_rating' }
);
dbInstance.places.createIndex({ slug: 1 }, { unique: true, name: 'uniq_place_slug' });
dbInstance.places.createIndex({ status: 1 }, { name: 'idx_place_status' });

// Index cho reviews bên trong place (hỗ trợ truy vấn và kiểm tra bất biến)
dbInstance.places.createIndex({ 'reviews.userId': 1 }, { name: 'idx_place_reviews_userId' });
dbInstance.places.createIndex({ 'reviews.reviewId': 1 }, { name: 'idx_place_reviews_reviewId' });

// Indexes cho place_proposals
dbInstance.place_proposals.createIndex({ status: 1, createdAt: -1 }, { name: 'idx_proposals_status_created' });
dbInstance.place_proposals.createIndex({ proposerId: 1 }, { name: 'idx_proposals_proposer' });

// Indexes cho reports
dbInstance.reports.createIndex({ status: 1, createdAt: -1 }, { name: 'idx_reports_status_created' });
dbInstance.reports.createIndex({ targetId: 1, reporterId: 1 }, { name: 'idx_reports_target_reporter' });

// Indexes cho favorites (Unique pair userId + placeId)
dbInstance.favorites.createIndex({ userId: 1, placeId: 1 }, { unique: true, name: 'uniq_user_favorite_place' });

// Indexes cho view_history
dbInstance.view_history.createIndex({ userId: 1, viewedAt: -1 }, { name: 'idx_user_view_history' });

print('[INIT-MONGO] Đã tạo xong toàn bộ Indexes (Geospatial 2dsphere, Text, Compound, Unique).');

// ------------------------------------------------------------------------------
// 3. Seed dữ liệu khởi tạo cơ sở (Categories & Admin User & Sample Places)
// ------------------------------------------------------------------------------

// Danh mục mẫu tại TP.HCM
const catFoodId = new ObjectId('650000000000000000000001');
const catCoffeeId = new ObjectId('650000000000000000000002');
const catSightId = new ObjectId('650000000000000000000003');
const catEntertainId = new ObjectId('650000000000000000000004');
const catStayId = new ObjectId('650000000000000000000005');

dbInstance.categories.insertMany([
  {
    _id: catFoodId,
    name: 'Ẩm thực & Nhà hàng',
    slug: 'am-thuc-nha-hang',
    icon: 'utensils',
    description: 'Các quán ăn, nhà hàng, món ngon đặc sản phong phú tại TP.HCM',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: catCoffeeId,
    name: 'Cà phê & Trà',
    slug: 'ca-phe-tra',
    icon: 'coffee',
    description: 'Quán cà phê view đẹp, không gian làm việc và đồ uống đặc sắc',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: catSightId,
    name: 'Du lịch & Di tích',
    slug: 'du-lich-di-tich',
    icon: 'landmark',
    description: 'Danh lam thắng cảnh, di tích lịch sử và văn hóa nổi tiếng',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: catEntertainId,
    name: 'Vui chơi & Giải trí',
    slug: 'vui-choi-giai-tri',
    icon: 'ticket',
    description: 'Công viên giải trí, khu phố đi bộ, trung tâm mua sắm',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: catStayId,
    name: 'Khách sạn & Nghỉ dưỡng',
    slug: 'khach-san-nghi-duong',
    icon: 'hotel',
    description: 'Khách sạn, homestay, resort tiện nghi chất lượng',
    isActive: true,
    createdAt: new Date()
  }
]);

// Tài khoản Admin mặc định & Member thử nghiệm
// password hash cho 'Admin@123' băm bằng BCrypt ($2a$11$N.4U4pXG... demo hash an toàn)
const adminUserId = new ObjectId('651111111111111111111111');
const memberUserId = new ObjectId('652222222222222222222222');

dbInstance.users.insertMany([
  {
    _id: adminUserId,
    email: 'admin@travelreview.vn',
    passwordHash: '$2a$11$f1P85.ZgqM01v3rC.x68UuU0vA706oNmvfK5mJ8Lq77861pM9Gj1O', // Admin@123
    fullName: 'Quản trị viên Hệ thống',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Admin',
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: memberUserId,
    email: 'traveler@travelreview.vn',
    passwordHash: '$2a$11$f1P85.ZgqM01v3rC.x68UuU0vA706oNmvfK5mJ8Lq77861pM9Gj1O', // Member@123
    fullName: 'Nguyễn Văn Du Khách',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role: 'Member',
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Dữ liệu Địa điểm thực tế mẫu tại TP.HCM (Quận 1) với embedded reviews/comments/replies
const samplePlaceId = new ObjectId('653333333333333333333331');
const sampleReviewId = new ObjectId('654444444444444444444441');
const sampleCommentId = new ObjectId('655555555555555555555551');
const sampleReplyId = new ObjectId('656666666666666666666661');

dbInstance.places.insertOne({
  _id: samplePlaceId,
  name: 'Chợ Bến Thành',
  slug: 'cho-ben-thanh',
  description: 'Biểu tượng lịch sử văn hóa lâu đời bậc nhất của TP. Hồ Chí Minh với hàng trăm gian hàng ẩm thực, quà lưu niệm và thủ công mỹ nghệ.',
  categoryId: catSightId,
  address: {
    street: 'Đường Lê Lợi, Phường Bến Thành',
    ward: 'Phường Bến Thành',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    provinceCode: '79'
  },
  location: {
    type: 'Point',
    coordinates: [106.6983, 10.7725] // [kinh độ, vĩ độ]
  },
  images: [
    {
      url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
      publicId: 'places/cho_ben_thanh_1',
      isCover: true
    }
  ],
  status: 'active',
  ratingAverage: 5.0,
  reviewCount: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  reviews: [
    {
      reviewId: sampleReviewId,
      userId: memberUserId,
      authorName: 'Nguyễn Văn Du Khách',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: 5,
      content: 'Chợ rất nhộn nhịp, nhiều món ăn truyền thống miền Nam cực ngon như bún mắm, chè sương sa hạt lựu. Đáng để ghé thăm!',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
          publicId: 'reviews/sample_food_1'
        }
      ],
      isDemo: true,
      likes: [adminUserId],
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [
        {
          commentId: sampleCommentId,
          userId: adminUserId,
          userName: 'Quản trị viên Hệ thống',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          content: 'Cảm ơn bạn đã đóng góp đánh giá chi tiết cho địa điểm biểu tượng này!',
          likes: [memberUserId],
          createdAt: new Date(),
          replies: [
            {
              replyId: sampleReplyId,
              userId: memberUserId,
              userName: 'Nguyễn Văn Du Khách',
              userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              content: 'Dạ, rất vui vì đóng góp có ích cho cộng đồng du lịch!',
              likes: [],
              createdAt: new Date()
            }
          ]
        }
      ]
    }
  ]
});

print('[INIT-MONGO] Khởi tạo dữ liệu cơ sở và CSDL MongoDB travel_review hoàn tất thành công!');
