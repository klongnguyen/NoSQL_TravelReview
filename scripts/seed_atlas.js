const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://nguyenkimlong261105_db_user:iy2ZlcEP5wVN9zZA@cluster0.jw3w09j.mongodb.net/?retryWrites=true&w=majority";
const dbName = "Travel_Review";

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log(`[ATLAS-SEED] Đã kết nối thành công tới MongoDB Atlas (${dbName})!`);
    const db = client.db(dbName);

    // 1. Tạo các collection
    const existingCollections = (await db.listCollections().toArray()).map(c => c.name);
    const collectionsToCreate = ['users', 'categories', 'places', 'place_proposals', 'reports', 'favorites', 'view_history'];

    for (const colName of collectionsToCreate) {
      if (!existingCollections.includes(colName)) {
        await db.createCollection(colName);
        console.log(`[ATLAS-SEED] + Tạo collection: ${colName}`);
      }
    }

    // 2. Tạo Indexes
    console.log('[ATLAS-SEED] Đang thiết lập Indexes...');
    await db.collection('places').createIndex({ location: '2dsphere' }, { name: 'geospatial_place_location' });
    await db.collection('places').createIndex({ name: 'text', description: 'text' }, { name: 'text_search_name_desc', default_language: 'none' });
    await db.collection('places').createIndex({ categoryId: 1, ratingAverage: -1, reviewCount: -1 }, { name: 'compound_cat_rating_count' });
    await db.collection('places').createIndex({ 'address.district': 1, ratingAverage: -1 }, { name: 'compound_district_rating' });
    await db.collection('places').createIndex({ slug: 1 }, { unique: true, name: 'uniq_place_slug' });

    await db.collection('users').createIndex({ email: 1 }, { unique: true, name: 'uniq_user_email' });
    await db.collection('favorites').createIndex({ userId: 1, placeId: 1 }, { unique: true, name: 'uniq_user_favorite_place' });
    await db.collection('view_history').createIndex({ userId: 1, viewedAt: -1 }, { name: 'idx_user_view_history' });
    console.log('[ATLAS-SEED] Đã tạo xong toàn bộ Indexes!');

    // 3. Seed Danh mục mẫu
    const catCount = await db.collection('categories').countDocuments();
    const catFoodId = new ObjectId('650000000000000000000001');
    const catCoffeeId = new ObjectId('650000000000000000000002');
    const catSightId = new ObjectId('650000000000000000000003');
    const catEntertainId = new ObjectId('650000000000000000000004');
    const catStayId = new ObjectId('650000000000000000000005');

    if (catCount === 0) {
      console.log('[ATLAS-SEED] Đang seed Categories...');
      await db.collection('categories').insertMany([
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
      console.log('[ATLAS-SEED] Seed categories thành công!');
    }

    // 4. Seed Users
    const userCount = await db.collection('users').countDocuments();
    const adminUserId = new ObjectId('651111111111111111111111');
    const memberUserId = new ObjectId('652222222222222222222222');

    if (userCount === 0) {
      console.log('[ATLAS-SEED] Đang seed Users mẫu...');
      await db.collection('users').insertMany([
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
      console.log('[ATLAS-SEED] Seed users thành công!');
    }

    // 5. Seed Địa điểm mẫu với Embedded Review & Comments (2 tầng)
    const placeCount = await db.collection('places').countDocuments();
    if (placeCount === 0) {
      console.log('[ATLAS-SEED] Đang seed Places với embedded reviews/comments/replies...');
      const samplePlaceId = new ObjectId('653333333333333333333331');
      const sampleReviewId = new ObjectId('654444444444444444444441');
      const sampleCommentId = new ObjectId('655555555555555555555551');
      const sampleReplyId = new ObjectId('656666666666666666666661');

      await db.collection('places').insertOne({
        _id: samplePlaceId,
        name: 'Chợ Bến Thành',
        slug: 'cho-ben-thanh',
        description: 'Biểu tượng lịch sử văn hóa lâu đời bậc nhất của TP. Hồ Chí Minh với hàng trăm gian hàng ẩm thực miền Nam, đồ lưu niệm và thủ công mỹ nghệ.',
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
          coordinates: [106.6983, 10.7725]
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
            content: 'Chợ rất nhộn nhịp, nhiều món ăn truyền thống miền Nam cực ngon như bún mắm, chè sương sa hạt lựu. Đáng ghé thăm!',
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
                content: 'Cảm ơn bạn đã đóng góp đánh giá chi tiết cho địa điểm biểu tượng này!',
                likes: [memberUserId],
                createdAt: new Date(),
                replies: [
                  {
                    replyId: sampleReplyId,
                    userId: memberUserId,
                    userName: 'Nguyễn Văn Du Khách',
                    content: 'Dạ, rất vui vì đóng góp có ích cho cộng đồng du lịch!',
                    createdAt: new Date()
                  }
                ]
              }
            ]
          }
        ]
      });
      console.log('[ATLAS-SEED] Seed sample places thành công!');
    }

    console.log('[ATLAS-SEED] === TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ LÊN ATLAS THÀNH CÔNG! ===');
  } catch (err) {
    console.error('[ATLAS-SEED] Lỗi:', err);
  } finally {
    await client.close();
  }
}

seed();
