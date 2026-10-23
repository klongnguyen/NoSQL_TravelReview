const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://nguyenkimlong261105_db_user:iy2ZlcEP5wVN9zZA@cluster0.jw3w09j.mongodb.net/?retryWrites=true&w=majority";
const dbName = "Travel_Review";

async function seedRealPlaces() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('[SEED-100] Kết nối tới MongoDB Atlas thành công!');
    const db = client.db(dbName);

    const catFoodId = new ObjectId('650000000000000000000001');
    const catCoffeeId = new ObjectId('650000000000000000000002');
    const catSightId = new ObjectId('650000000000000000000003');
    const catEntertainId = new ObjectId('650000000000000000000004');
    const catStayId = new ObjectId('650000000000000000000005');

    const adminUserId = new ObjectId('651111111111111111111111');
    const memberUserId = new ObjectId('652222222222222222222222');

    const sampleLocations = [
      // 1. Di tích & Du lịch
      {
        name: 'Dinh Độc Lập (Hội trường Thống Nhất)',
        slug: 'dinh-doc-lap',
        description: 'Di tích quốc gia đặc biệt ghi dấu mốc son lịch sử dân tộc năm 1975, mang kiến trúc độc đáo kết hợp hài hòa giữa hiện đại và triết lý phương Đông.',
        catId: catSightId,
        street: '135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành',
        district: 'Quận 1',
        coordinates: [106.6953, 10.7770],
        imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
        rating: 4.9,
        reviewsCount: 15
      },
      {
        name: 'Nhà Thờ Đức Bà Sài Gòn',
        slug: 'nha-tho-duc-ba-sai-gon',
        description: 'Kiệt tác kiến trúc Gothic Roman tuyệt mỹ giữa lòng thành phố, được xây dựng từ thế kỷ 19 với toàn bộ gạch ngói vận chuyển từ Marseille, Pháp.',
        catId: catSightId,
        street: '01 Công xã Paris, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.6990, 10.7798],
        imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        rating: 4.8,
        reviewsCount: 12
      },
      {
        name: 'Bưu Điện Trung Tâm Sài Gòn',
        slug: 'buu-dien-trung-tam-sai-gon',
        description: 'Công trình kiến trúc Phục Hưng kinh điển do Gustave Eiffel thiết kế, nổi bật với mái vòm cong cổ kính và bản đồ lịch sử hai bên sảnh.',
        catId: catSightId,
        street: '02 Công xã Paris, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.6998, 10.7798],
        imageUrl: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?w=800',
        rating: 4.8,
        reviewsCount: 10
      },
      {
        name: 'Bảo Tàng Chứng Tích Chiến Tranh',
        slug: 'bao-tang-chung-tich-chien-tranh',
        description: 'Một trong những bảo tàng thu hút du khách quốc tế đông nhất Việt Nam, nơi lưu giữ những tư liệu, hiện vật lịch sử chân thực và xúc động.',
        catId: catSightId,
        street: '28 Võ Văn Tần, Phường Võ Thị Sáu',
        district: 'Quận 3',
        coordinates: [106.6923, 10.7794],
        imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?w=800',
        rating: 4.7,
        reviewsCount: 14
      },
      {
        name: 'Bến Nhà Rồng (Bảo tàng Hồ Chí Minh)',
        slug: 'ben-nha-rong',
        description: 'Di tích lịch sử bên bờ sông Sài Gòn, nơi người thanh niên yêu nước Nguyễn Tất Thành ra đi tìm đường cứu nước năm 1911.',
        catId: catSightId,
        street: '01 Nguyễn Tất Thành, Phường 12',
        district: 'Quận 4',
        coordinates: [106.7067, 10.7681],
        imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
        rating: 4.7,
        reviewsCount: 8
      },
      {
        name: 'Chùa Bửu Long',
        slug: 'chua-buu-long',
        description: 'Ngôi chùa có kiến trúc bảo tháp lộng lẫy theo phong cách Thái Lan và Ấn Độ cổ, được tạp chí National Geographic bình chọn là một trong 20 ngôi chùa đẹp nhất thế giới.',
        catId: catSightId,
        street: '81 Nguyễn Xiển, Phường Long Bình',
        district: 'TP. Thủ Đức',
        coordinates: [106.8406, 10.8711],
        imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800',
        rating: 4.9,
        reviewsCount: 16
      },
      {
        name: 'Chùa Ngọc Hoàng (Phước Hải Tự)',
        slug: 'chua-ngoc-hoang',
        description: 'Ngôi chùa cổ linh thiêng nổi tiếng từng đón cựu Tổng thống Mỹ Barack Obama ghé thăm năm 2016, kiến trúc chạm khắc gỗ tinh xảo.',
        catId: catSightId,
        street: '73 Mai Thị Lựu, Phường Đa Kao',
        district: 'Quận 1',
        coordinates: [106.6983, 10.7915],
        imageUrl: 'https://images.unsplash.com/photo-1548625361-195fe57870a0?w=800',
        rating: 4.8,
        reviewsCount: 9
      },
      {
        name: 'Chợ Lớn (Chợ Bình Tây)',
        slug: 'cho-lon-binh-tay',
        description: 'Trung tâm giao thương sầm uất mang đậm nét văn hóa kiến trúc người Hoa với mái ngói chồng tầng và các gian hàng đặc sản phong phú.',
        catId: catSightId,
        street: '57A Tháp Mười, Phường 2',
        district: 'Quận 6',
        coordinates: [106.6506, 10.7495],
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        rating: 4.6,
        reviewsCount: 11
      },

      // 2. Ẩm thực & Nhà hàng
      {
        name: 'Cơm Tấm Ba Ghiền',
        slug: 'com-tam-ba-ghien',
        description: 'Quán cơm tấm trứ danh Sài Gòn với miếng sườn nướng khổng lồ ướp đậm đà, được vinh danh trong cẩm nang ẩm thực Michelin Guide.',
        catId: catFoodId,
        street: '84 Đặng Văn Ngữ, Phường 10',
        district: 'Phú Nhuận',
        coordinates: [106.6718, 10.7925],
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        rating: 4.7,
        reviewsCount: 18
      },
      {
        name: 'Phở Hòa Pasteur',
        slug: 'pho-hoa-pasteur',
        description: 'Quán phở truyền thống lâu đời phục vụ phong cách phở Nam với nước dùng thơm ngọt từ xương hầm, rau thơm phong phú và quẩy giòn.',
        catId: catFoodId,
        street: '260C Pasteur, Phường Võ Thị Sáu',
        district: 'Quận 3',
        coordinates: [106.6881, 10.7876],
        imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
        rating: 4.8,
        reviewsCount: 14
      },
      {
        name: 'Bánh Mì Huỳnh Hoa',
        slug: 'banh-mi-huynh-hoa',
        description: 'Huyền thoại bánh mì patê kẹp ngập tràn thịt nguội, chả lụa và dưa góp tươi giòn, nổi tiếng cả trong nước lẫn du khách quốc tế.',
        catId: catFoodId,
        street: '26 Lê Thị Riêng, Phường Bến Thành',
        district: 'Quận 1',
        coordinates: [106.6918, 10.7711],
        imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
        rating: 4.7,
        reviewsCount: 20
      },
      {
        name: 'Quán Bụi — Authentic Vietnamese',
        slug: 'quan-bui-authentic-vietnamese',
        description: 'Không gian ấm cúng mộc mạc phục vụ những món cơm nhà thuần túy Việt Nam như thịt kho tộ, canh chua cá lóc, rau luộc kho quẹt.',
        catId: catFoodId,
        street: '19 Ngô Văn Năm, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.7051, 10.7801],
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        rating: 4.8,
        reviewsCount: 11
      },
      {
        name: 'Pizza 4P\'s — Bến Thành',
        slug: 'pizza-4ps-ben-thanh',
        description: 'Thương hiệu pizza phô mai thủ công phong cách Nhật Bản lừng danh, nổi tiếng với Burrata phô mai tươi và dịch vụ Omotenashi chu đáo.',
        catId: catFoodId,
        street: '8 Thủ Khoa Huân, Phường Bến Thành',
        district: 'Quận 1',
        coordinates: [106.6966, 10.7738],
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        rating: 4.9,
        reviewsCount: 16
      },
      {
        name: 'Dim Tu Tac — Đông Du',
        slug: 'dim-tu-tac-dong-du',
        description: 'Nhà hàng ẩm thực Quảng Đông cao cấp với các món dimsum tinh xảo, vịt quay Bắc Kinh da giòn rụm và hải sản tươi sống.',
        catId: catFoodId,
        street: '55 Đông Du, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.7047, 10.7749],
        imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800',
        rating: 4.8,
        reviewsCount: 13
      },

      // 3. Cà phê & Trà
      {
        name: 'The Workshop Coffee',
        slug: 'the-workshop-coffee',
        description: 'Quán specialty coffee tiên phong tại Sài Gòn trên tầng 2 chung cư cổ điển, chuyên các dòng hạt rang xay cao cấp và pha thủ công pour-over.',
        catId: catCoffeeId,
        street: '27 Ngô Đức Kế, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.7042, 10.7738],
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
        rating: 4.8,
        reviewsCount: 12
      },
      {
        name: 'Okkio Caffe — Lê Lợi',
        slug: 'okkio-caffe-le-loi',
        description: 'Không gian cà phê mang tone màu đỏ đất ấm áp và ánh sáng tự nhiên tinh tế, điểm hẹn lý tưởng cho những người sành cà phê.',
        catId: catCoffeeId,
        street: '120 Lê Lợi, Phường Bến Thành',
        district: 'Quận 1',
        coordinates: [106.6975, 10.7731],
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        rating: 4.7,
        reviewsCount: 9
      },
      {
        name: 'Dabao Concept — Cố Đô',
        slug: 'dabao-concept-co-do',
        description: 'Quán cà phê mang hơi thở kiến trúc nhà rường truyền thống đan xen hiện đại, ngập tràn cây xanh và không gian thư giãn yên tĩnh.',
        catId: catCoffeeId,
        street: '18 Tú Xương, Phường Võ Thị Sáu',
        district: 'Quận 3',
        coordinates: [106.6853, 10.7811],
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
        rating: 4.7,
        reviewsCount: 15
      },
      {
        name: 'Cafe Trầm — Phú Nhuận',
        slug: 'cafe-tram-phu-nhuan',
        description: 'Không gian quán tĩnh lặng với tiếng nước róc rách, hồ cá koi và nhạc không lời du dương, tách biệt hoàn toàn khỏi sự ồn ào phố thị.',
        catId: catCoffeeId,
        street: '100 Trần Huy Liệu, Phường 15',
        district: 'Phú Nhuận',
        coordinates: [106.6781, 10.7932],
        imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
        rating: 4.6,
        reviewsCount: 10
      },

      // 4. Vui chơi & Giải trí
      {
        name: 'Phố Đi Bộ Nguyễn Huệ',
        slug: 'pho-di-bo-nguyen-hue',
        description: 'Quảng trường đi bộ trung tâm sôi động bậc nhất thành phố, nơi diễn ra các lễ hội văn hóa, biểu diễn nghệ thuật đường phố và ngắm cảnh đêm.',
        catId: catEntertainId,
        street: 'Đường Nguyễn Huệ, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.7032, 10.7745],
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?w=800',
        rating: 4.8,
        reviewsCount: 19
      },
      {
        name: 'Landmark 81 SkyView',
        slug: 'landmark-81-skyview',
        description: 'Tòa tháp cao nhất Việt Nam với đài quan sát SkyView trên tầng 79-81, mang lại tầm nhìn toàn cảnh 360 độ ngoạn mục ngắm trọn vẹn thành phố.',
        catId: catEntertainId,
        street: '720A Điện Biên Phủ, Phường 22',
        district: 'Bình Thạnh',
        coordinates: [106.7218, 10.7952],
        imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
        rating: 4.9,
        reviewsCount: 17
      },
      {
        name: 'Thảo Cầm Viên Sài Gòn',
        slug: 'thao-cam-vien-sai-gon',
        description: 'Một trong những vườn bách thảo - thú lâu đời nhất thế giới với hơn 150 năm tuổi, sở hữu hệ sinh thái thực vật quý hiếm và không gian xanh mát.',
        catId: catEntertainId,
        street: '02 Nguyễn Bỉnh Khiêm, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.7056, 10.7876],
        imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800',
        rating: 4.6,
        reviewsCount: 13
      },
      {
        name: 'Phố Tây Bùi Viện',
        slug: 'pho-tay-bui-vien',
        description: 'Tụ điểm giải trí đêm náo nhiệt dành cho giới trẻ và khách du lịch quốc tế với âm nhạc sôi động, bia đường phố và ẩm thực đa dạng.',
        catId: catEntertainId,
        street: 'Đường Bùi Viện, Phường Phạm Ngũ Lão',
        district: 'Quận 1',
        coordinates: [106.6925, 10.7672],
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        rating: 4.5,
        reviewsCount: 14
      },

      // 5. Khách sạn & Nghỉ dưỡng
      {
        name: 'The Reverie Saigon',
        slug: 'the-reverie-saigon',
        description: 'Khách sạn 6 sao xa hoa bậc nhất Sài Gòn với phong cách hoàng gia Ý tráng lệ, dịch vụ spa đẳng cấp và ẩm thực thượng lưu.',
        catId: catStayId,
        street: '22-36 Nguyễn Huệ, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.7038, 10.7735],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        rating: 4.9,
        reviewsCount: 10
      },
      {
        name: 'Caravelle Saigon',
        slug: 'caravelle-saigon',
        description: 'Khách sạn biểu tượng lịch sử nhìn ra Nhà hát Thành phố, nơi từng đón tiếp nhiều nguyên thủ quốc gia và các phóng viên quốc tế thời kỳ 1960.',
        catId: catStayId,
        street: '19-23 Lam Sơn Square, Phường Bến Nghé',
        district: 'Quận 1',
        coordinates: [106.7031, 10.7766],
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        rating: 4.8,
        reviewsCount: 8
      },
      {
        name: 'Mia Saigon Luxury Boutique Hotel',
        slug: 'mia-saigon-luxury-boutique-hotel',
        description: 'Khu nghỉ dưỡng ven sông phong cách Indochine thanh lịch tại bán đảo An Phú, sở hữu hoàng hôn tuyệt đẹp và hồ bơi ngoài trời nhìn ra sông Sài Gòn.',
        catId: catStayId,
        street: '2-4 Đường số 10, Phường An Phú',
        district: 'TP. Thủ Đức',
        coordinates: [106.7412, 10.8038],
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        rating: 4.8,
        reviewsCount: 11
      }
    ];

    console.log(`[SEED-100] Bắt đầu chèn ${sampleLocations.length} địa điểm thực tế tại TP.HCM vào MongoDB Atlas...`);

    for (const loc of sampleLocations) {
      const existing = await db.collection('places').findOne({ slug: loc.slug });
      if (existing) continue;

      const placeId = new ObjectId();
      const review1Id = new ObjectId();
      const comment1Id = new ObjectId();
      const reply1Id = new ObjectId();

      const placeDoc = {
        _id: placeId,
        name: loc.name,
        slug: loc.slug,
        description: loc.description,
        categoryId: loc.catId,
        address: {
          street: loc.street,
          ward: 'Khu trung tâm',
          district: loc.district,
          city: 'Hồ Chí Minh',
          provinceCode: '79'
        },
        location: {
          type: 'Point',
          coordinates: loc.coordinates
        },
        images: [
          { url: loc.imageUrl, publicId: `places/${loc.slug}`, isCover: true }
        ],
        status: 'active',
        ratingAverage: loc.rating,
        reviewCount: loc.reviewsCount,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviews: [
          {
            reviewId: review1Id,
            userId: memberUserId,
            authorName: 'Nguyễn Văn Du Khách',
            authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            rating: Math.round(loc.rating),
            content: `Trải nghiệm tại ${loc.name} rất ấn tượng! Không gian sạch đẹp, dịch vụ chu đáo và giữ được nét đặc trưng riêng biệt của Sài Gòn. Rất đáng giới thiệu cho bạn bè!`,
            images: [{ url: loc.imageUrl, publicId: 'reviews/demo_img' }],
            isDemo: true,
            likes: [adminUserId],
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000), // Cách đây 2 ngày (vẫn trong hạn 7 ngày)
            updatedAt: new Date(),
            comments: [
              {
                commentId: comment1Id,
                userId: adminUserId,
                userName: 'Quản trị viên Hệ thống',
                content: 'Cảm ơn bạn đã đóng góp review và hình ảnh cho cộng đồng!',
                likes: [memberUserId],
                createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
                replies: [
                  {
                    replyId: reply1Id,
                    userId: memberUserId,
                    userName: 'Nguyễn Văn Du Khách',
                    content: 'Dạ, rất sẵn lòng chia sẻ thêm nhiều địa điểm hữu ích!',
                    likes: [],
                    createdAt: new Date()
                  }
                ]
              }
            ]
          }
        ]
      };

      await db.collection('places').insertOne(placeDoc);
      console.log(`[SEED-100] + Đã thêm: ${loc.name} (${loc.district})`);
    }

    const totalPlaces = await db.collection('places').countDocuments();
    console.log(`[SEED-100] === HOÀN THÀNH SEED DỮ LIỆU! Tổng địa điểm hiện có trên Atlas: ${totalPlaces} ===`);
  } catch (err) {
    console.error('[SEED-100] Lỗi khi seed dữ liệu:', err);
  } finally {
    await client.close();
  }
}

seedRealPlaces();
