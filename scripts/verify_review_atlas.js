const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://nguyenkimlong261105_db_user:iy2ZlcEP5wVN9zZA@cluster0.jw3w09j.mongodb.net/?retryWrites=true&w=majority";

async function verify() {
  console.log('--- BẮT ĐẦU KIỂM TRA ĐĂNG ĐÁNH GIÁ LƯU VÀO MONGODB ATLAS ---');
  // 1. Đăng nhập lấy token
  const loginRes = await fetch('http://localhost:5196/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'member@longo.vn', password: 'Member@123' })
  });
  const loginData = await loginRes.json();
  console.log('1. Đăng nhập thành công:', loginData.fullName, 'ID:', loginData.userId);

  // 2. Lấy 1 địa điểm từ database (VD: Dinh Độc Lập)
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('Travel_Review');
  const place = await db.collection('places').findOne({ slug: 'dinh-doc-lap' });
  const placeId = place._id.toString();
  console.log('2. Địa điểm kiểm tra:', place.name, 'PlaceId:', placeId, 'ReviewCount hiện tại:', place.reviews?.length || 0);

  // Xóa review trước đó của member này nếu có để test sạch sẽ (BR-08: mỗi user chỉ có 1 review)
  await db.collection('places').updateOne(
    { _id: place._id },
    { $pull: { reviews: { userId: loginData.userId } } }
  );

  // 3. Gửi POST review qua Web API
  const newReviewContent = 'LonGo Test Review ' + new Date().toLocaleTimeString('vi-VN') + ' - Trải nghiệm di tích lịch sử rất tuyệt vời, hướng dẫn viên nhiệt tình!';
  const postRes = await fetch(`http://localhost:5196/api/places/${placeId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.token}`
    },
    body: JSON.stringify({
      rating: 5,
      content: newReviewContent,
      images: []
    })
  });

  const postResult = await postRes.json();
  console.log('3. Kết quả gọi API POST /api/places/{id}/reviews:', postRes.status, postResult);

  // 4. Kiểm tra trực tiếp vào MongoDB Atlas
  const updatedPlace = await db.collection('places').findOne({ _id: place._id });
  console.log('4. Kiểm tra trực tiếp MongoDB Atlas:');
  console.log('   - ReviewCount mới:', updatedPlace.reviews.length);
  console.log('   - RatingAverage mới:', updatedPlace.ratingAverage);
  
  const savedReview = updatedPlace.reviews.find(r => r.userId === loginData.userId);
  if (savedReview) {
    console.log('   -> XÁC NHẬN: Review đã được lưu thành công vào MongoDB Atlas!');
    console.log('      Tác giả:', savedReview.authorName);
    console.log('      Nội dung:', savedReview.content);
    console.log('      Số sao:', savedReview.rating);
    console.log('      Thời gian:', savedReview.createdAt);
  } else {
    console.error('   -> LỖI: Không tìm thấy review trong MongoDB Atlas!');
  }

  await client.close();
}

verify().catch(console.error);
