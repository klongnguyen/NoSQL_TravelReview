const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb+srv://nguyenkimlong261105_db_user:iy2ZlcEP5wVN9zZA@cluster0.jw3w09j.mongodb.net/?retryWrites=true&w=majority";
const dbName = "Travel_Review";

// =========================================================================
// DANH SÁCH 65 ĐỊA ĐIỂM DU LỊCH & DI TÍCH THỰC TẾ TRÊN TOÀN QUỐC
// Phân bố đều qua các Tỉnh / Thành phố lớn (TP.HCM, Hà Nội, Đà Nẵng, Huế,
// Hội An, Đà Lạt, Hạ Long, Nha Trang, Phú Quốc, Ninh Bình, Sa Pa, Hà Giang,
// Vũng Tàu, Tây Ninh, Tiền Giang, Cần Thơ, Bình Thuận...)
// =========================================================================

const RAW_PLACES_REGISTRY = [
  // -----------------------------------------------------------
  // 1. THỦ ĐÔ HÀ NỘI
  // -----------------------------------------------------------
  {
    name: "Hồ Hoàn Kiếm & Đền Ngọc Sơn",
    slug: "ho-hoan-kiem-den-ngoc-son",
    description: "Trái tim của Thủ đô Hà Nội ngàn năm văn hiến, gắn liền với truyền thuyết vua Lê Lợi trả gươm báu cho Rùa thần. Cầu Thê Húc màu son rực rỡ dẫn vào đền Ngọc Sơn cổ kính giữa mặt nước xanh biếc.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Đinh Tiên Hoàng, Phường Hàng Trống",
    district: "Quận Hoàn Kiếm",
    city: "Hà Nội",
    provinceCode: "01",
    coordinates: [105.8524, 21.0285],
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:00 - 18:00 (Đền Ngọc Sơn), Quanh hồ mở tự do 24/7",
    ticketPrice: "30.000đ / người lớn vào Đền Ngọc Sơn (Khu vực quanh hồ miễn phí)",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 38500,
    googleReviewSnippet: "Không gian đi bộ cuối tuần rất nhộn nhịp. Cảnh Tháp Rùa soi bóng dưới làn sương sớm mùa thu đẹp nao lòng."
  },
  {
    name: "Văn Miếu - Quốc Tử Giám",
    slug: "van-mieu-quoc-tu-giam",
    description: "Trường đại học đầu tiên của Việt Nam, xây dựng từ năm 1070 dưới triều vua Lý Thánh Tông. Nơi lưu giữ 82 bia Tiến sĩ vinh danh truyền thống hiếu học của dân tộc.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "58 Quốc Tử Giám, Phường Văn Miếu",
    district: "Quận Đống Đa",
    city: "Hà Nội",
    provinceCode: "01",
    coordinates: [105.8358, 21.0294],
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80",
    openingHours: "08:00 - 17:00 (Hàng ngày, có tour đêm Thứ 4 - Chủ Nhật)",
    ticketPrice: "70.000đ / người lớn (Học sinh/sinh viên: 35.000đ)",
    ticketType: "paid",
    googleRating: 4.7,
    googleReviewCount: 24600,
    googleReviewSnippet: "Kiến trúc gỗ cổ kính tuyệt đẹp, cây cối xanh mát và không khí tôn nghiêm. Tour đêm 'Tinh hoa đạo học' với công nghệ 3D mapping cực kỳ xuất sắc."
  },
  {
    name: "Hoàng Thành Thăng Long",
    slug: "hoang-thanh-thang-long",
    description: "Di sản Văn hóa Thế giới UNESCO với bề dày lịch sử hơn 13 thế kỷ, trung tâm quyền lực chính trị qua các triều đại Lý, Trần, Lê, Mạc và Nguyễn.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "19C Hoàng Diệu, Phường Điện Biên",
    district: "Quận Ba Đình",
    city: "Hà Nội",
    provinceCode: "01",
    coordinates: [105.8406, 21.0345],
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80",
    openingHours: "08:00 - 17:00 (Thứ Ba đến Chủ Nhật, đóng cửa Thứ Hai)",
    ticketPrice: "70.000đ / người lớn",
    ticketType: "paid",
    googleRating: 4.6,
    googleReviewCount: 16200,
    googleReviewSnippet: "Di tích khảo cổ học dưới lòng đất cực kỳ ấn tượng, Đoan Môn bề thế và nhiều góc chụp ảnh áo dài cổ phục rất đẹp."
  },
  {
    name: "Phố Cổ Hà Nội (36 Phố Phường)",
    slug: "pho-co-ha-noi",
    description: "Khu đô thị cổ mang đậm dấu ấn kiến trúc nhà ống truyền thống của thế kỷ 19, mỗi phố gắn liền với một làng nghề thủ công và thiên đường ẩm thực đường phố trứ danh.",
    categoryName: "Vui chơi",
    catSlug: "vui-choi",
    street: "Khu vực Hàng Ngang, Hàng Đào, Mã Mây, Tạ Hiện",
    district: "Quận Hoàn Kiếm",
    city: "Hà Nội",
    provinceCode: "01",
    coordinates: [105.8510, 21.0350],
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở cả ngày (Chợ đêm & phố đi bộ từ 18:00 Thứ 6 - Chủ Nhật)",
    ticketPrice: "Miễn phí tham quan",
    ticketType: "free",
    googleRating: 4.6,
    googleReviewCount: 31000,
    googleReviewSnippet: "Ẩm thực vô địch: bún chả, bún thang, chả cá Lã Vọng, cà phê trứng Giảng... Đi bộ ngắm phố xá cổ kính rất thi vị."
  },

  // -----------------------------------------------------------
  // 2. TP. ĐÀ NẴNG
  // -----------------------------------------------------------
  {
    name: "Sun World Bà Nà Hills & Cầu Vàng",
    slug: "ba-na-hills-cau-vang",
    description: "Khu du lịch trên đỉnh núi Chúa ở độ cao 1.487m với khí hậu 4 mùa trong 1 ngày. Cây Cầu Vàng nâng đỡ bởi bàn tay khổng lồ phủ rêu phong là kiệt tác kiến trúc được thế giới ca ngợi.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Thôn An Sơn, Xã Hòa Ninh",
    district: "Huyện Hòa Vang",
    city: "Đà Nẵng",
    provinceCode: "48",
    coordinates: [107.9877, 15.9986],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:30 - 21:00 (Hàng ngày)",
    ticketPrice: "900.000đ / người lớn (Ngoại tỉnh bao gồm cáp treo khứ hồi)",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 42000,
    googleReviewSnippet: "Cáp treo dài nhất thế giới ngắm mây ngàn bồng bềnh. Cầu Vàng sáng sớm lúc chưa đông khách đẹp kỳ ảo như chốn thần tiên."
  },
  {
    name: "Bãi Biển Mỹ Khê",
    slug: "bai-bien-my-khe",
    description: "Được tạp chí Forbes bình chọn là một trong 6 bãi biển quyến rũ nhất hành tinh với dải cát trắng mịn, độ dốc thoai thoải, nước biển trong xanh ấm áp quanh năm.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Đường Võ Nguyên Giáp, Phường Phước Mỹ",
    district: "Quận Sơn Trà",
    city: "Đà Nẵng",
    provinceCode: "48",
    coordinates: [108.2435, 16.0592],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở cả ngày (Lực lượng cứu hộ bờ biển trực 05:00 - 18:30)",
    ticketPrice: "Miễn phí tắm biển",
    ticketType: "free",
    googleRating: 4.7,
    googleReviewCount: 29500,
    googleReviewSnippet: "Biển cực sạch, không hề có rác, sóng êm thích hợp tắm biển buổi sáng sớm đón bình minh tuyệt đẹp."
  },
  {
    name: "Cầu Rồng Sông Hàn",
    slug: "cau-rong-song-han",
    description: "Cây cầu độc nhất vô nhị mang hình dáng con Rồng thép thời Lý vươn mình ra biển lớn. Cầu có khả năng phun lửa và phun nước rực rỡ vào mỗi tối Thứ Bảy và Chủ Nhật.",
    categoryName: "Vui chơi",
    catSlug: "vui-choi",
    street: "Đường Nguyễn Văn Linh, Phường Phước Ninh",
    district: "Quận Hải Châu",
    city: "Đà Nẵng",
    provinceCode: "48",
    coordinates: [108.2272, 16.0611],
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở 24/7 (Phun lửa & phun nước lúc 21:00 Thứ 7, Chủ Nhật)",
    ticketPrice: "Miễn phí tham quan",
    ticketType: "free",
    googleRating: 4.7,
    googleReviewCount: 22800,
    googleReviewSnippet: "Trải nghiệm xem rồng phun lửa lúc 9h tối cuối tuần rất náo nhiệt. Nhớ đứng lùi lại phía sau nếu không muốn bị ướt khi rồng phun nước!"
  },
  {
    name: "Bán Đảo Sơn Trà & Chùa Linh Ứng",
    slug: "ban-dao-son-tra-chua-linh-ung",
    description: "Lá phổi xanh của Đà Nẵng với khu bảo tồn loài voọc chà vá chân nâu quý hiếm. Chùa Linh Ứng Bãi Bụt nổi bật với tượng Phật Bà Quan Âm cao 67m hướng nhìn ra biển Đông.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Khu vực Bãi Bụt, Phường Thọ Quang",
    district: "Quận Sơn Trà",
    city: "Đà Nẵng",
    provinceCode: "48",
    coordinates: [108.2778, 16.1006],
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:00 - 18:30 (Hàng ngày)",
    ticketPrice: "Miễn phí vé vào cửa",
    ticketType: "free",
    googleRating: 4.8,
    googleReviewCount: 27100,
    googleReviewSnippet: "View ngắm toàn cảnh vịnh Đà Nẵng từ trên cao cực kỳ ngoạn mục. Không khí thanh tịnh, thiêng liêng và gió biển mát lành."
  },

  // -----------------------------------------------------------
  // 3. TỈNH QUẢNG NAM (HỘI AN)
  // -----------------------------------------------------------
  {
    name: "Phố Cổ Hội An & Chùa Cầu",
    slug: "pho-co-hoi-an-chua-cau",
    description: "Di sản Văn hóa Thế giới bảo tồn nguyên vẹn hơn 1.000 di tích kiến trúc gồm nhà cổ, hội quán, đền chùa và Chùa Cầu biểu tượng, rực rỡ lồng đèn khi đêm về.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Đường Trần Phú, Nguyễn Thái Học, Bạch Đằng",
    district: "Thành phố Hội An",
    city: "Quảng Nam",
    provinceCode: "49",
    coordinates: [108.3272, 15.8776],
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở cả ngày (Phố đi bộ cấm xe từ 09:00 - 11:00 & 15:00 - 21:30)",
    ticketPrice: "120.000đ / vé tham quan 5 điểm di tích tùy chọn",
    ticketType: "paid",
    googleRating: 4.9,
    googleReviewCount: 45000,
    googleReviewSnippet: "Không khí hoài cổ, thơ mộng bậc nhất Việt Nam. Ngồi thuyền thả hoa đăng trên sông Hoài và ăn cao lầu là trải nghiệm không thể quên."
  },
  {
    name: "Thánh Địa Mỹ Sơn",
    slug: "thanh-dia-my-son",
    description: "Quần thể đền tháp Chăm Pa cổ kính nằm ẩn mình trong thung lũng khép kín, từng là trung tâm cúng tế và lăng mộ hoàng gia Chăm Pa từ thế kỷ 4 đến thế kỷ 14.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Xã Duy Phú, Huyện Duy Xuyên",
    district: "Huyện Duy Xuyên",
    city: "Quảng Nam",
    provinceCode: "49",
    coordinates: [108.1250, 15.7981],
    imageUrl: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:30 - 17:00 (Hàng ngày)",
    ticketPrice: "100.000đ / khách Việt, 150.000đ / khách quốc tế",
    ticketType: "paid",
    googleRating: 4.6,
    googleReviewCount: 18200,
    googleReviewSnippet: "Bí ẩn về kỹ thuật xây tháp bằng gạch nung không dùng vữa của người Chăm cổ xưa khiến ai nấy đều thán phục."
  },

  // -----------------------------------------------------------
  // 4. TỈNH THỪA THIÊN HUẾ
  // -----------------------------------------------------------
  {
    name: "Quần Thể Di Tích Đại Nội Huế (Hoàng Thành)",
    slug: "dai-noi-hue",
    description: "Trọng tâm của Quần thể Di tích Cố đô Huế được UNESCO công nhận năm 1993, nơi sinh hoạt và làm việc của 13 vị vua triều Nguyễn với Ngọ Môn, Điện Thái Hòa và Tử Cấm Thành.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Đường 23 Tháng 8, Phường Thuận Thành",
    district: "Thành phố Huế",
    city: "Thừa Thiên Huế",
    provinceCode: "46",
    coordinates: [107.5779, 16.4698],
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:30 - 17:30 (Hàng ngày)",
    ticketPrice: "200.000đ / người lớn (Nên mua vé tuyến kết hợp lăng tẩm để tiết kiệm)",
    ticketType: "paid",
    googleRating: 4.7,
    googleReviewCount: 33000,
    googleReviewSnippet: "Quy mô cung điện cực kỳ bề thế. Nên thuê áo dài truyền thống hoặc cổ phục Nhật Bình chụp ảnh quanh cung Diên Thọ và điện Thái Hòa."
  },
  {
    name: "Chùa Thiên Mụ & Sông Hương",
    slug: "chua-thien-mu-song-huong",
    description: "Ngôi quốc tự cổ nhất xứ Huế xây dựng từ năm 1601 bởi chúa Tiên Nguyễn Hoàng. Tháp Phước Duyên 7 tầng sừng sững bên bờ bắc sông Hương thơ mộng.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Đường Nguyễn Phúc Nguyên, Phường Kim Long",
    district: "Thành phố Huế",
    city: "Thừa Thiên Huế",
    provinceCode: "46",
    coordinates: [107.5452, 16.4526],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:00 - 18:00 (Hàng ngày)",
    ticketPrice: "Miễn phí vé vào cổng",
    ticketType: "free",
    googleRating: 4.8,
    googleReviewCount: 21500,
    googleReviewSnippet: "Tiếng chuông chùa Thiên Mụ ngân vang lúc hoàng hôn buông xuống sông Hương là một trong những trải nghiệm bình yên nhất đời người."
  },
  {
    name: "Lăng Khải Định (Ứng Lăng)",
    slug: "lang-khai-dinh",
    description: "Đỉnh cao của nghệ thuật ghép mảnh sành sứ và thủy tinh độc đáo, giao thoa tinh tế giữa kiến trúc cung đình phương Đông và Gothic hiện đại phương Tây.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Xã Thủy Bằng, Thành phố Huế",
    district: "Thành phố Huế",
    city: "Thừa Thiên Huế",
    provinceCode: "46",
    coordinates: [107.5905, 16.3989],
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:30 - 17:30 (Hàng ngày)",
    ticketPrice: "150.000đ / người lớn",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 19800,
    googleReviewSnippet: "Cung Thiên Định bên trong tráng lệ đến kinh ngạc, bức bích họa 'Cửu Long Ẩn Vân' trên trần vẽ bằng chân và nghệ thuật khảm sành sứ vô cùng tinh xảo."
  },

  // -----------------------------------------------------------
  // 5. TỈNH LÂM ĐỒNG (ĐÀ LẠT)
  // -----------------------------------------------------------
  {
    name: "Quảng Trường Lâm Viên & Hồ Xuân Hương",
    slug: "quang-truong-lam-vien-ho-xuan-huong",
    description: "Biểu tượng hiện đại của phố núi ngàn hoa với khối nụ hoa Atiso và đóa hoa dã quỳ bằng kính màu khổng lồ soi bóng bên mặt hồ Xuân Hương thơ mộng.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Đường Trần Quốc Toản, Phường 1",
    district: "Thành phố Đà Lạt",
    city: "Lâm Đồng",
    provinceCode: "68",
    coordinates: [108.4428, 11.9366],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở tự do cả ngày lẫn đêm",
    ticketPrice: "Miễn phí tham quan",
    ticketType: "free",
    googleRating: 4.7,
    googleReviewCount: 36000,
    googleReviewSnippet: "Đi dạo hoặc đạp vịt trên hồ Xuân Hương lúc chiều se lạnh, rồi ghé uống sữa đậu nành nóng hổi và ăn bánh tráng nướng thì tuyệt vời."
  },
  {
    name: "Khu Du Lịch Thác Datanla",
    slug: "thac-datanla-da-lat",
    description: "Ngọn thác hùng vĩ nằm giữa đèo Prenn rợp bóng thông xanh, sở hữu hệ thống máng trượt xuyên rừng dài nhất Đông Nam Á (2.400m) và trò chơi đu dây mạo hiểm High Rope Course.",
    categoryName: "Vui chơi",
    catSlug: "vui-choi",
    street: "Đèo Prenn, Quốc lộ 20, Phường 3",
    district: "Thành phố Đà Lạt",
    city: "Lâm Đồng",
    provinceCode: "68",
    coordinates: [108.4485, 11.9029],
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:30 - 17:00 (Hàng ngày)",
    ticketPrice: "50.000đ vé vào cổng; Máng trượt khứ hồi: 200.000đ / người lớn",
    ticketType: "paid",
    googleRating: 4.7,
    googleReviewCount: 28400,
    googleReviewSnippet: "Trò trượt máng cảm giác mạnh qua rừng thông cực kỳ đã và an toàn! Dòng thác nước đổ trắng xóa, không khí trong lành mát rượi."
  },
  {
    name: "Đỉnh Núi Langbiang",
    slug: "dinh-langbiang",
    description: "Nóc nhà của cao nguyên Lâm Viên cao 2.167m, gắn liền với thiên tình sử diễm lệ của chàng K'lang và nàng H'biang của đồng bào K'Ho.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Thị trấn Lạc Dương, Huyện Lạc Dương",
    district: "Huyện Lạc Dương",
    city: "Lâm Đồng",
    provinceCode: "68",
    coordinates: [108.4345, 12.0448],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:00 - 17:30 (Hàng ngày)",
    ticketPrice: "50.000đ vé vào cổng; Xe jeep lên đỉnh: 120.000đ / người khứ hồi",
    ticketType: "paid",
    googleRating: 4.6,
    googleReviewCount: 21900,
    googleReviewSnippet: "Ngồi xe jeep leo dốc khúc khuỷu rất thú vị. Lên đỉnh ngắm trọn hồ Đankia - Suối Vàng từ trên mây đẹp choáng ngợp."
  },

  // -----------------------------------------------------------
  // 6. TỈNH QUẢNG NINH (HẠ LONG)
  // -----------------------------------------------------------
  {
    name: "Vịnh Hạ Long (Kỳ Quan Thiên Nhiên Thế Giới)",
    slug: "vinh-ha-long",
    description: "Kỳ quan thiên nhiên thế giới UNESCO với gần 2.000 hòn đảo đá vôi nhô lên từ làn nước xanh ngọc lục bảo, tạo nên bức tranh thủy mặc kỳ vĩ của tạo hóa.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Cảng tàu khách quốc tế Hạ Long, Phường Bãi Cháy",
    district: "Thành phố Hạ Long",
    city: "Quảng Ninh",
    provinceCode: "22",
    coordinates: [107.0843, 20.9101],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:30 - 18:30 (Tàu tham quan theo tuyến)",
    ticketPrice: "290.000đ vé thắng cảnh tuyến 1 hoặc tuyến 2 + tiền thuê tàu",
    ticketType: "paid",
    googleRating: 4.9,
    googleReviewCount: 48000,
    googleReviewSnippet: "Cảnh sắc hang Sửng Sốt và đảo Ti Tốp đẹp nghẹt thở. Đi du thuyền qua đêm ngắm hoàng hôn và chèo kayak xuyên hang Luồn là trải nghiệm đỉnh cao."
  },
  {
    name: "Khu Di Tích Danh Thắng Yên Tử",
    slug: "danh-thang-yen-tu",
    description: "Cái nôi của Phật giáo Trúc Lâm Yên Tử do Phật hoàng Trần Nhân Tông sáng lập thế kỷ 13, quần thể chùa tháp thanh tịnh giữa non thiêng mây ngàn.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Xã Thượng Yên Công, Thành phố Uông Bí",
    district: "Thành phố Uông Bí",
    city: "Quảng Ninh",
    provinceCode: "22",
    coordinates: [106.7212, 21.1578],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:00 - 18:00 (Cáp treo vận hành liên tục)",
    ticketPrice: "40.000đ vé thắng cảnh; Cáp treo khứ hồi 4 chặng: 350.000đ",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 16700,
    googleReviewSnippet: "Chùa Đồng tọa lạc trên đỉnh núi cao 1.068m trong mây gió ngút ngàn. Không gian khu nghỉ dưỡng Legacy Yên Tử kiến trúc triều Trần rất đẳng cấp."
  },

  // -----------------------------------------------------------
  // 7. TỈNH NINH BÌNH
  // -----------------------------------------------------------
  {
    name: "Quần Thể Danh Thắng Tràng An",
    slug: "quan-the-trang-an",
    description: "Di sản Thế giới kép đầu tiên và duy nhất tại Đông Nam Á, nổi bật với hệ thống hang động xuyên thủy kỳ ảo, đền thờ linh thiêng và thung lũng đá vôi ngập nước hoang sơ.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Xã Ninh Xuân, Huyện Hoa Lư",
    district: "Huyện Hoa Lư",
    city: "Ninh Bình",
    provinceCode: "37",
    coordinates: [105.9080, 20.2506],
    imageUrl: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:00 - 17:00 (Hàng ngày)",
    ticketPrice: "250.000đ / người lớn (Bao gồm thuyền đò tuyến 3 tiếng)",
    ticketType: "paid",
    googleRating: 4.9,
    googleReviewCount: 39000,
    googleReviewSnippet: "Nước sông trong vắt nhìn thấy rong rêu dưới đáy. Các cô lái đò chèo thuyền qua hang Tối, hang Sáng cực kỳ điêu luyện và thân thiện."
  },
  {
    name: "Quần Thể Chùa Bái Đính",
    slug: "chua-bai-dinh",
    description: "Ngôi chùa nắm giữ nhiều kỷ lục nhất châu Á và Việt Nam: tượng Phật bằng đồng dát vàng lớn nhất, hành lang 500 vị La Hán bằng đá xanh dài nhất châu lục.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Xã Gia Sinh, Huyện Gia Viễn",
    district: "Huyện Gia Viễn",
    city: "Ninh Bình",
    provinceCode: "37",
    coordinates: [105.8569, 20.2978],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:00 - 21:00 (Hàng ngày)",
    ticketPrice: "Miễn phí vé vào cửa (Vé xe điện 30.000đ/chặng; Thăm Bảo tháp 50.000đ)",
    ticketType: "free",
    googleRating: 4.7,
    googleReviewCount: 26500,
    googleReviewSnippet: "Khuôn viên chùa rộng lớn mênh mông, kiến trúc đồ sộ và tôn nghiêm. Buổi tối khi các tòa bảo tháp lên đèn rực rỡ như hoàng cung."
  },
  {
    name: "Hang Múa & Đỉnh Ngọa Long",
    slug: "hang-mua-dinh-ngoa-long",
    description: "Được mệnh danh là 'Vạn Lý Trường Thành thu nhỏ' của Việt Nam với gần 500 bậc đá uốn lượn dẫn lên đỉnh núi Múa, nơi có tượng rồng đá canh giữ và view toàn cảnh Tam Cốc ngút ngàn.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Thôn Khê Đầu Hạ, Xã Ninh Xuân",
    district: "Huyện Hoa Lư",
    city: "Ninh Bình",
    provinceCode: "37",
    coordinates: [105.9389, 20.2319],
    imageUrl: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:00 - 19:00 (Đón hoàng hôn đẹp nhất lúc 17:30)",
    ticketPrice: "100.000đ / người lớn",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 23100,
    googleReviewSnippet: "Leo gần 500 bậc thang khá mỏi chân nhưng khi lên đỉnh nhìn xuống cánh đồng lúa chín vàng Tam Cốc thì thấy xứng đáng từng giọt mồ hôi!"
  },

  // -----------------------------------------------------------
  // 8. TỈNH LÀO CAI (SA PA)
  // -----------------------------------------------------------
  {
    name: "Đỉnh Fansipan - Nóc Nhà Đông Dương",
    slug: "dinh-fansipan-sa-pa",
    description: "Đỉnh núi cao nhất bán đảo Đông Dương (3.143m), điểm hẹn săn mây huyền thoại với quần thể tâm linh kỳ vĩ trên đỉnh mây ngàn và tuyến cáp treo 3 dây đạt kỷ lục thế giới.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "KDL Sun World Fansipan Legend, Phường Sa Pa",
    district: "Thị xã Sa Pa",
    city: "Lào Cai",
    provinceCode: "10",
    coordinates: [103.7758, 22.3034],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:30 - 17:30 (Hàng ngày)",
    ticketPrice: "850.000đ vé cáp treo khứ hồi người lớn",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 34000,
    googleReviewSnippet: "Khoảnh khắc đứng trên cột mốc 3.143m chạm tay vào biển mây cuồn cuộn là cảm giác tự hào không gì tả xiết. Đại tượng Phật A Di Đà bằng đồng cực kỳ uy nghiêm."
  },
  {
    name: "Bản Cát Cát (Bản Cổ Của Người Mông)",
    slug: "ban-cat-cat-sa-pa",
    description: "Ngôi làng cổ kính của đồng bào dân tộc H'Mông nằm nép mình bên thung lũng Mường Hoa, nổi tiếng với nghề dệt thổ cẩm, guồng nước gỗ khổng lồ và thác Tiên Sa róc rách.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Xã Hoàng Liên, Thị xã Sa Pa",
    district: "Thị xã Sa Pa",
    city: "Lào Cai",
    provinceCode: "10",
    coordinates: [103.8315, 22.3292],
    imageUrl: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:00 - 18:30 (Hàng ngày)",
    ticketPrice: "150.000đ / người lớn",
    ticketType: "paid",
    googleRating: 4.6,
    googleReviewCount: 22000,
    googleReviewSnippet: "Nên thuê trang phục dân tộc Mông chụp ảnh bên suối Hoa và cối xay nước, rất nhiều góc ảnh đẹp đậm chất Tây Bắc."
  },

  // -----------------------------------------------------------
  // 9. TỈNH HÀ GIANG
  // -----------------------------------------------------------
  {
    name: "Đèo Mã Pí Lèng & Hẻm Tu Sản (Sông Nho Quế)",
    slug: "deo-ma-pi-leng-song-nho-que",
    description: "Vua của tứ đại đỉnh đèo miền Bắc với cung đường uốn lượn chênh vênh giữa vách đá tai mèo sừng sững, phía dưới là dòng sông Nho Quế xanh như ngọc bích chảy qua hẻm vực sâu nhất Đông Nam Á.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Quốc lộ 4C, Xã Pải Lủng",
    district: "Huyện Mèo Vạc",
    city: "Hà Giang",
    provinceCode: "03",
    coordinates: [105.4167, 23.2389],
    imageUrl: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở tự do ngắm cảnh; Thuyền sông Nho Quế chạy 07:00 - 17:30",
    ticketPrice: "Miễn phí ngắm đèo; Vé đi thuyền sông Nho Quế: 120.000đ / người",
    ticketType: "paid",
    googleRating: 4.9,
    googleReviewCount: 28000,
    googleReviewSnippet: "Cảnh tượng thiên nhiên hùng vĩ vượt ngoài sức tưởng tượng! Đi thuyền lướt trên mặt nước xanh ngọc bích giữa hai vách đá dựng đứng cao ngút trời khiến ai cũng lặng người."
  },
  {
    name: "Cột Cờ Lũng Cú (Địa Đầu Tổ Quốc)",
    slug: "cot-co-lung-cu-ha-giang",
    description: "Điểm cực Bắc thiêng liêng của Tổ quốc Việt Nam nằm trên đỉnh núi Rồng ở độ cao gần 1.500m, lá cờ đỏ sao vàng rộng 54m² tượng trưng cho 54 dân tộc anh em tung bay kiêu hãnh.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Xã Lũng Cú, Huyện Đồng Văn",
    district: "Huyện Đồng Văn",
    city: "Hà Giang",
    provinceCode: "03",
    coordinates: [105.3167, 23.3606],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    openingHours: "07:00 - 17:30 (Hàng ngày)",
    ticketPrice: "25.000đ / người lớn (Xe điện lên chân cột cờ 30.000đ khứ hồi)",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 17500,
    googleReviewSnippet: "Được đứng chào cờ tại điểm cực Bắc thiêng liêng là trải nghiệm đầy xúc động. Từ trên đỉnh cột cờ nhìn thấy bản Lô Lô Chải thanh bình."
  },

  // -----------------------------------------------------------
  // 10. TỈNH KHÁNH HÒA (NHA TRANG)
  // -----------------------------------------------------------
  {
    name: "Tháp Bà Ponagar Nha Trang",
    slug: "thap-ba-ponagar-nha-trang",
    description: "Quần thể đền tháp Chăm Pa cổ xây dựng từ thế kỷ 8 đến thế kỷ 13 thờ nữ thần Thiên Y A Na, tọa lạc trên đồi Cù Lao nhìn ra dòng sông Cái thơ mộng.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Đường 2 Tháng 4, Phường Vĩnh Phước",
    district: "Thành phố Nha Trang",
    city: "Khánh Hòa",
    provinceCode: "56",
    coordinates: [109.1950, 12.2653],
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    openingHours: "08:00 - 17:30 (Hàng ngày)",
    ticketPrice: "30.000đ / người lớn",
    ticketType: "paid",
    googleRating: 4.7,
    googleReviewCount: 25000,
    googleReviewSnippet: "Kiến trúc gạch nung rực rỡ dưới nắng biển, các điệu múa Chăm truyền thống với tiếng trống Paranưng và kèn Saranai rất cuốn hút."
  },
  {
    name: "VinWonders Nha Trang (Đảo Hòn Tre)",
    slug: "vinwonders-nha-trang-hon-tre",
    description: "Công viên giải trí kỷ lục trên đảo Hòn Tre với tuyến cáp treo vượt biển Nha Trang, công viên nước trên bờ biển và show diễn thực cảnh Tata Show triệu đô.",
    categoryName: "Vui chơi",
    catSlug: "vui-choi",
    street: "Đảo Hòn Tre, Phường Vĩnh Nguyên",
    district: "Thành phố Nha Trang",
    city: "Khánh Hòa",
    provinceCode: "56",
    coordinates: [109.2431, 12.2185],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    openingHours: "08:00 - 20:00 (Hàng ngày)",
    ticketPrice: "800.000đ / người lớn (Bao gồm cáp treo hoặc cano)",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 37000,
    googleReviewSnippet: "Rất nhiều trò chơi đẳng cấp thế giới, đu quay mặt trời ngắm vịnh Nha Trang siêu đẹp. Tata Show lúc 19h30 tối đỉnh cao nghệ thuật."
  },

  // -----------------------------------------------------------
  // 11. TỈNH KIÊN GIANG (PHÚ QUỐC)
  // -----------------------------------------------------------
  {
    name: "Bãi Sao Phú Quốc",
    slug: "bai-sao-phu-quoc",
    description: "Một trong những bãi biển đẹp nhất đảo ngọc Phú Quốc với bờ cát trắng mịn màng như kem, rặng dừa nghiêng bóng và làn nước biển phẳng lặng màu ngọc bích.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Ấp Bãi Sao, Phường An Thới",
    district: "Thành phố Phú Quốc",
    city: "Kiên Giang",
    provinceCode: "91",
    coordinates: [104.0322, 10.0520],
    imageUrl: "/images/bai-sao-phu-quoc.jpg",
    openingHours: "Mở tự do cả ngày",
    ticketPrice: "Miễn phí tắm biển (Ghế dù và tắm nước ngọt: 50.000đ - 100.000đ)",
    ticketType: "free",
    googleRating: 4.6,
    googleReviewCount: 24000,
    googleReviewSnippet: "Cát ở Bãi Sao trắng mịn hiếm nơi nào sánh bằng, nước thoai thoải rất an toàn cho trẻ nhỏ. Hàng dừa xích đu check-in siêu ăn ảnh."
  },
  {
    name: "Grand World Phú Quốc (Thành Phố Không Ngủ)",
    slug: "grand-world-phu-quoc",
    description: "Quần thể vui chơi giải trí hoạt động 24/7 với dòng kênh Venice lãng mạn, bảo tàng Gấu Teddy, công trình Tre khổng lồ và show diễn thực cảnh 'Sắc Màu Venice' miễn phí mỗi tối.",
    categoryName: "Vui chơi",
    catSlug: "vui-choi",
    street: "Khu Bãi Dài, Xã Gành Dầu",
    district: "Thành phố Phú Quốc",
    city: "Kiên Giang",
    provinceCode: "91",
    coordinates: [103.8569, 10.3278],
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở cửa 24/7",
    ticketPrice: "Vào cửa tự do miễn phí (Thuyền Gondola sông Venice: 200.000đ)",
    ticketType: "free",
    googleRating: 4.8,
    googleReviewCount: 31500,
    googleReviewSnippet: "Show nhạc nước trên hồ Venice lúc 21h45 tối hoành tráng đến nổi da gà! Quán bar, nhà hàng sáng đèn suốt đêm không khí sôi động."
  },
  {
    name: "Cáp Treo Hòn Thơm Vượt Biển",
    slug: "cap-treo-hon-thom-phu-quoc",
    description: "Tuyến cáp treo ba dây vượt biển dài nhất thế giới (7.899m) nối liền thị trấn Hoàng Hôn Sunset Town với đảo Hòn Thơm, bay ngang qua làng chài ngắm biển ngọc từ trên cao.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Thị trấn Hoàng Hôn, Phường An Thới",
    district: "Thành phố Phú Quốc",
    city: "Kiên Giang",
    provinceCode: "91",
    coordinates: [104.0089, 9.9989],
    imageUrl: "/images/cap-treo-hon-thom.jpg",
    openingHours: "09:00 - 17:30 (Chạy theo khung giờ)",
    ticketPrice: "650.000đ / người lớn khứ hồi (Bao gồm công viên nước Aquatopia)",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 26000,
    googleReviewSnippet: "Ngồi cáp treo ngắm nhìn hàng trăm tàu cá neo đậu và màu nước biển chuyển màu ngoạn mục. Công viên nước Aquatopia trên đảo chơi cực vui."
  },

  // -----------------------------------------------------------
  // 12. TỈNH BÌNH THUẬN (PHAN THIẾT - MŨI NÉ)
  // -----------------------------------------------------------
  {
    name: "Đồi Cát Bay Mũi Né (Đồi Cát Đỏ)",
    slug: "doi-cat-bay-mui-ne",
    description: "Tiểu sa mạc kỳ thú của Bình Thuận với những đồi cát mênh mông liên tục thay đổi hình dạng theo từng cơn gió biển, rực rỡ sắc màu vàng đỏ lúc hoàng hôn.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Đường Võ Nguyên Giáp, Phường Mũi Né",
    district: "Thành phố Phan Thiết",
    city: "Bình Thuận",
    provinceCode: "60",
    coordinates: [108.2910, 10.9525],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở tự do cả ngày (Đẹp nhất lúc 05:30 - 07:00 & 16:30 - 18:00)",
    ticketPrice: "Miễn phí vé vào cửa (Thuê ván trượt cát: 20.000đ)",
    ticketType: "free",
    googleRating: 4.6,
    googleReviewCount: 21000,
    googleReviewSnippet: "Trượt cát rất vui, chụp ảnh phong cách sa mạc Dubai cực kỳ độc đáo. Nên đi sáng sớm để cát không bị nóng chân."
  },
  {
    name: "Bàu Trắng (Bạch Hồ) & Cung Đường Ven Biển",
    slug: "bau-trang-binh-thuan",
    description: "Hồ sen nước ngọt tự nhiên nằm giữa sa mạc cát trắng tinh khôi, cung đường ven biển đẹp bậc nhất Việt Nam với trải nghiệm xe mô tô địa hình ATV và xe jeep vượt đồi cát.",
    categoryName: "Check-in thiên nhiên",
    catSlug: "check-in-thien-nhien",
    street: "Thôn Hồng Lâm, Xã Hòa Thắng",
    district: "Huyện Bắc Bình",
    city: "Bình Thuận",
    provinceCode: "60",
    coordinates: [108.4239, 11.0631],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
    openingHours: "06:00 - 18:00 (Hàng ngày)",
    ticketPrice: "15.000đ vé vào cổng; Thuê xe Jeep vượt đồi cát: 600.000đ / xe",
    ticketType: "paid",
    googleRating: 4.8,
    googleReviewCount: 24500,
    googleReviewSnippet: "Cảm giác ngồi xe Jeep phóng thẳng xuống dốc cát thẳng đứng thót tim nhưng siêu phấn khích! Cảnh hồ nước giữa sa mạc cát đẹp như trong phim viễn tây."
  },

  // -----------------------------------------------------------
  // 13. THÀNH PHỐ CẦN THƠ
  // -----------------------------------------------------------
  {
    name: "Chợ Nổi Cái Răng Cần Thơ",
    slug: "cho-noi-cai-rang-can-tho",
    description: "Di sản Văn hóa Phi vật thể Quốc gia, nét văn hóa sông nước đặc trưng của miền Tây Nam Bộ với hàng trăm ghe xuồng buôn bán nông sản 'treo bẹo' tấp nập buổi bình minh.",
    categoryName: "Du lịch & Di tích",
    catSlug: "du-lich-di-tich",
    street: "Sông Cần Thơ, Số 46 Đường Hai Bà Trưng",
    district: "Quận Cái Răng",
    city: "Cần Thơ",
    provinceCode: "92",
    coordinates: [105.7483, 10.0053],
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80",
    openingHours: "05:00 - 10:00 (Nhộn nhịp nhất lúc 05:30 - 07:30)",
    ticketPrice: "Thuê ghe đò tham quan: 350.000đ - 600.000đ / thuyền",
    ticketType: "paid",
    googleRating: 4.7,
    googleReviewCount: 29000,
    googleReviewSnippet: "Ăn tô bún riêu cua bốc khói và uống ly cà phê đá lắc lư ngay trên ghe thuyền giữa sông sớm mai là trải nghiệm đậm chất hào sảng Nam Bộ!"
  },
  {
    name: "Bến Ninh Kiều & Cầu Đi Bộ Tình Yêu",
    slug: "ben-ninh-kieu-cau-tinh-yeu",
    description: "Thắng cảnh đệ nhất Tây Đô soi bóng bên ngã ba sông Hậu và sông Cần Thơ, cầu đi bộ uốn lượn hình chữ S với hai đài sen rực rỡ đèn LED về đêm.",
    categoryName: "Vui chơi",
    catSlug: "vui-choi",
    street: "Đường Hai Bà Trưng, Phường Tân An",
    district: "Quận Ninh Kiều",
    city: "Cần Thơ",
    provinceCode: "92",
    coordinates: [105.7878, 10.0336],
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80",
    openingHours: "Mở tự do 24/7 (Phố đi bộ và du thuyền từ 18:00 - 22:30)",
    ticketPrice: "Miễn phí tham quan",
    ticketType: "free",
    googleRating: 4.7,
    googleReviewCount: 27500,
    googleReviewSnippet: "Gió sông Hậu thổi lồng lộng mát mẻ, lên du thuyền Ninh Kiều nghe đờn ca tài tử và ngắm cầu Cần Thơ lung linh ánh đèn."
  }
];

// Tải 42 địa điểm hiện có (TP.HCM, Vũng Tàu, Tây Ninh, Tiền Giang) từ file cũ
const existingRealPlacesModule = require('../frontend/src/data/realPlacesData.js');
const existingPlaces = existingRealPlacesModule.REAL_PLACES_DATA || [];

console.log('Loaded existing places:', existingPlaces.length);
console.log('New national places to add:', RAW_PLACES_REGISTRY.length);

// =========================================================================
// HỆ THỐNG SINH ĐÁNH GIÁ (35 - 45 REVIEWS MỖI ĐỊA ĐIỂM)
// Có đầy đủ Đánh giá cấp 1 (Review) và Đánh giá cấp 2 (Comments & Replies)
// =========================================================================

const REVIEWER_PROFILES = [
  { name: "Nguyễn Hải Đăng", avatar: "https://images.unsplash.com/photo-1535713875002?w=150" },
  { name: "Trần Minh Quang", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150" },
  { name: "Lê Thị Thảo Vy", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { name: "Phạm Quốc Hưng", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { name: "Đỗ Bích Ngọc", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
  { name: "Vũ Hoàng Sơn", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { name: "Bùi Thị Mai Anh", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
  { name: "Hoàng Gia Bảo", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" },
  { name: "Ngô Trọng Tín", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
  { name: "Đặng Thị Phương Linh", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
  { name: "Trịnh Văn Hùng", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" },
  { name: "Lý Gia Hân", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { name: "Huỳnh Tuấn Kiệt", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150" },
  { name: "Phan Nhật Nam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" },
  { name: "Cao Thùy Trang", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150" },
  { name: "Dương Minh Trí", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150" },
  { name: "Võ Thị Thanh Thủy", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150" },
  { name: "Tạ Quang Dũng", avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150" },
  { name: "Nguyễn Khánh Huyền", avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150" },
  { name: "Michael Vance", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { name: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { name: "Trương Vĩnh Kỳ", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { name: "Nguyễn Đăng Khoa", avatar: "https://images.unsplash.com/photo-1535713875002?w=150" },
  { name: "Đào Thị Thu Hà", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { name: "Lâm Quốc Cường", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" }
];

const POSITIVE_REVIEW_CONTENTS = [
  "Trải nghiệm tuyệt vời hơn cả mong đợi! Không gian thoáng đãng, cảnh quan được gìn giữ rất sạch sẽ và chỉn chu.",
  "Một điểm đến nhất định phải ghé ít nhất một lần trong đời. Cảnh sắc thiên nhiên và không khí ở đây khiến tâm hồn nhẹ bẫng.",
  "Chụp ảnh góc nào cũng đẹp mê ly, ánh sáng tự nhiên rất ăn ảnh. Nên đi vào buổi sáng sớm để tránh đông đúc.",
  "Dịch vụ và hướng dẫn viên rất chu đáo, giải thích tận tình nguồn gốc lịch sử và văn hóa địa phương.",
  "Giá vé hoàn toàn tương xứng với chất lượng trải nghiệm. Khuôn viên rộng rãi, có nhiều chỗ nghỉ chân râm mát.",
  "Gia đình mình có cả người lớn tuổi và trẻ nhỏ đi cùng, ai cũng thích và khen ngợi không gian ở đây.",
  "Đồ ăn và đặc sản xung quanh khu vực này rất ngon, giá cả niêm yết rõ ràng không lo bị chặt chém.",
  "Hoàng hôn ở đây đẹp đến ngỡ ngàng, gió biển và mây trời tạo nên bức tranh thiên nhiên tuyệt mỹ.",
  "Tổ chức rất chuyên nghiệp, các bảng chỉ dẫn và khu vệ sinh đều sạch sẽ và hiện đại.",
  "Rất tự hào về danh lam thắng cảnh của đất nước mình. Chắc chắn sẽ quay lại cùng bạn bè vào dịp tới."
];

const MODERATE_REVIEW_CONTENTS = [
  "Cảnh quan và kiến trúc rất đẹp nhưng đi vào cuối tuần thì cực kỳ đông đúc, phải xếp hàng chờ khá lâu.",
  "Địa điểm đẹp, tuy nhiên bãi đỗ xe ô tô vào giờ cao điểm hơi quá tải, mọi người nên cân nhắc đi xe máy hoặc taxi.",
  "Thời tiết vào buổi trưa khá nắng gắt, mọi người nhớ mang theo mũ nón, kem chống nắng và nước lọc nhé.",
  "Khuôn viên rất rộng, đi bộ tham quan mỏi rã rời cả chân. Khuyên các bạn nữ không nên đi giày cao gót.",
  "Một số dịch vụ bên ngoài cổng giá hơi cao so với mặt bằng chung, nên hỏi giá trước khi mua sắm đồ lưu niệm."
];

const CRITICAL_REVIEW_CONTENTS = [
  "Hôm mình đi trúng ngày bảo trì một số hạng mục nên không tham quan được trọn vẹn, hơi tiếc một chút.",
  "Khách đoàn đi ồn ào quá, ban quản lý nên nhắc nhở để giữ gìn không gian tôn nghiêm và trật tự chung.",
  "Đường vào đoạn cuối có vài chỗ đang sửa chữa hơi bụi, mùa mưa có thể hơi trơn trượt cần đi chậm."
];

// Mẫu bình luận cấp 2 (Comments) và phản hồi (Replies)
const LEVEL2_QUESTION_COMMENTS = [
  "Bạn ơi cho mình hỏi đi vào ngày thường có đông không, hay chỉ cuối tuần mới đông vậy?",
  "Chỗ này có cho mang theo đồ ăn nhẹ và nước uống từ ngoài vào không bạn?",
  "Vé vào cửa có bao gồm dịch vụ xe điện/cáp treo luôn chưa hay phải mua riêng vậy bạn?",
  "Đi vào tháng mấy trong năm là thời tiết đẹp và ít mưa nhất thế bạn ơi?",
  "Bên trong có chỗ cho thuê trang phục truyền thống để chụp ảnh sống ảo không bạn?"
];

const LEVEL2_ANSWER_REPLIES = [
  "Chào bạn, ngày thường đỡ đông hơn nhiều nhé, đi tầm 8h sáng là vắng và chụp hình thoải mái nhất!",
  "Được mang theo nước lọc và bánh ngọt nhẹ nhé bạn, nhưng nhớ gom rác bỏ vào thùng để giữ vệ sinh chung nha.",
  "Vé cáp treo/xe điện mua riêng tại quầy hoặc mua combo trên quầy điện tử nhé bạn, mua trước sẽ tiết kiệm hơn đó.",
  "Thời điểm đẹp nhất là từ tháng 11 đến tháng 4 hàng năm nha bạn, lúc đó trời khô ráo, nắng ấm cực kỳ đẹp.",
  "Có nhiều tiệm cho thuê trang phục ngay cổng vào nhé bạn, giá từ 100k - 200k/bộ đầy đủ phụ kiện luôn!"
];

const ADMIN_COMMUNITY_REPLIES = [
  "Cảm ơn bạn đã ghé thăm và để lại đánh giá chi tiết! Ban quản lý luôn nỗ lực nâng cao trải nghiệm của du khách.",
  "Cảm ơn phản hồi thực tế từ bạn! Chúng tôi đã ghi nhận góp ý về bãi giữ xe và đang mở rộng thêm khu vực đón khách.",
  "Rất vui vì bạn và gia đình đã có chuyến đi đáng nhớ tại địa danh lịch sử này. Chúc bạn luôn có những hành trình tuyệt vời!"
];

// Hàm sinh một danh sách 35 - 45 reviews cho một địa điểm
function generateReviewsForPlace(placeName, placeSlug, baseRating = 4.7) {
  const reviewsCount = Math.floor(Math.random() * 11) + 35; // 35 đến 45 đánh giá
  const reviews = [];

  for (let i = 0; i < reviewsCount; i++) {
    const profile = REVIEWER_PROFILES[i % REVIEWER_PROFILES.length];
    
    // Phân bổ rating: 70% 5 sao, 20% 4 sao, 10% 1-3 sao
    const rand = Math.random();
    let rating = 5;
    let contentPool = POSITIVE_REVIEW_CONTENTS;
    if (rand < 0.08) {
      rating = Math.random() < 0.5 ? 2 : 3;
      contentPool = CRITICAL_REVIEW_CONTENTS;
    } else if (rand < 0.28) {
      rating = 4;
      contentPool = MODERATE_REVIEW_CONTENTS;
    }

    const baseContent = contentPool[Math.floor(Math.random() * contentPool.length)];
    const reviewContent = `${placeName}: ${baseContent}`;
    
    // Ngày đánh giá rải đều trong năm 2025 - 2026
    const daysAgo = Math.floor(Math.random() * 300) + 1;
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString();

    const reviewId = `rev-${placeSlug}-${i + 1}`;

    // Sinh bình luận cấp 2 (Comments & Replies) cho khoảng 40% số reviews
    const comments = [];
    if (Math.random() < 0.45) {
      const commenter = REVIEWER_PROFILES[(i + 3) % REVIEWER_PROFILES.length];
      const commentQuestion = LEVEL2_QUESTION_COMMENTS[Math.floor(Math.random() * LEVEL2_QUESTION_COMMENTS.length)];
      
      const commentDate = new Date(date.getTime() + 4 * 3600 * 1000).toISOString();
      const commentId = `cmt-${placeSlug}-${i + 1}-1`;

      // Trả lời con (Reply) bên dưới comment
      const replies = [];
      if (Math.random() < 0.8) {
        const replyAuthor = Math.random() < 0.4 ? { name: "Ban Quản Lý Di Tích", avatar: "https://images.unsplash.com/photo-1534528741775?w=150" } : profile;
        const replyText = replyAuthor.name.includes("Ban Quản Lý") 
          ? ADMIN_COMMUNITY_REPLIES[Math.floor(Math.random() * ADMIN_COMMUNITY_REPLIES.length)]
          : LEVEL2_ANSWER_REPLIES[Math.floor(Math.random() * LEVEL2_ANSWER_REPLIES.length)];

        replies.push({
          replyId: `rep-${placeSlug}-${i + 1}-1-1`,
          userId: `usr-${Math.floor(Math.random() * 9000) + 1000}`,
          userName: replyAuthor.name,
          userAvatar: replyAuthor.avatar,
          content: replyText,
          likes: [],
          createdAt: new Date(date.getTime() + 8 * 3600 * 1000).toISOString()
        });
      }

      comments.push({
        commentId: commentId,
        userId: `usr-${Math.floor(Math.random() * 9000) + 1000}`,
        userName: commenter.name,
        userAvatar: commenter.avatar,
        content: commentQuestion,
        likes: [],
        createdAt: commentDate,
        replies: replies
      });
    }

    reviews.push({
      reviewId: reviewId,
      userId: `usr-${Math.floor(Math.random() * 9000) + 1000}`,
      authorName: profile.name,
      authorAvatar: profile.avatar,
      rating: rating,
      content: reviewContent,
      createdAt: dateStr,
      isGoogleReview: Math.random() < 0.6,
      likes: Math.random() < 0.5 ? [`usr-${Math.floor(Math.random() * 100)}`, `usr-${Math.floor(Math.random() * 100)}`] : [],
      comments: comments
    });
  }

  return reviews;
}

// =========================================================================
// TIẾN TRÌNH XÂY DỰNG BỘ DỮ LIỆU ĐẦY ĐỦ VÀ CẬP NHẬT DATABASE
// =========================================================================

async function run() {
  console.log('=== STARTING RICH PLACES & REVIEWS GENERATION ===');
  
  // 1. Kết hợp danh sách cũ và danh sách mới
  const allPlaces = [];

  // Thêm các địa điểm cũ và nâng cấp reviews từ 10 lên 35-45 + bình luận cấp 2
  existingPlaces.forEach((p, idx) => {
    const slug = p.slug || `place-${idx}`;
    const richReviews = generateReviewsForPlace(p.name, slug, p.googleRating || 4.7);
    
    // Tính lại rating trung bình thật
    const avgRating = (richReviews.reduce((sum, r) => sum + r.rating, 0) / richReviews.length).toFixed(1);

    allPlaces.push({
      ...p,
      ratingAverage: parseFloat(avgRating),
      reviewCount: richReviews.length,
      reviews: richReviews
    });
  });

  // Thêm các địa điểm mới từ toàn quốc
  RAW_PLACES_REGISTRY.forEach((p, idx) => {
    const richReviews = generateReviewsForPlace(p.name, p.slug, p.googleRating);
    const avgRating = (richReviews.reduce((sum, r) => sum + r.rating, 0) / richReviews.length).toFixed(1);

    allPlaces.push({
      id: `place-${p.slug}`,
      name: p.name,
      slug: p.slug,
      description: p.description,
      categoryName: p.categoryName,
      catSlug: p.catSlug,
      address: {
        street: p.street,
        ward: p.district,
        district: p.district,
        city: p.city,
        provinceCode: p.provinceCode
      },
      location: {
        type: "Point",
        coordinates: p.coordinates
      },
      images: [
        {
          url: p.imageUrl,
          isCover: true,
          publicId: `places/${p.slug}`
        }
      ],
      status: "active",
      ratingAverage: parseFloat(avgRating),
      reviewCount: richReviews.length,
      googleRating: p.googleRating,
      googleReviewCount: p.googleReviewCount,
      googleReviewSnippet: p.googleReviewSnippet,
      openingHours: p.openingHours,
      ticketPrice: p.ticketPrice,
      ticketType: p.ticketType,
      isOpenNow: true,
      reviews: richReviews
    });
  });

  console.log(`Generated total of ${allPlaces.length} places!`);

  let totalReviews = 0;
  let totalLevel2Comments = 0;
  let totalLevel2Replies = 0;

  allPlaces.forEach(p => {
    totalReviews += p.reviews.length;
    p.reviews.forEach(r => {
      totalLevel2Comments += (r.comments || []).length;
      (r.comments || []).forEach(c => {
        totalLevel2Replies += (c.replies || []).length;
      });
    });
  });

  console.log(`- Total Level 1 Reviews: ${totalReviews} (~${(totalReviews / allPlaces.length).toFixed(1)} per place)`);
  console.log(`- Total Level 2 Comments: ${totalLevel2Comments}`);
  console.log(`- Total Level 2 Replies: ${totalLevel2Replies}`);

  // 2. Ghi ra file frontend/src/data/realPlacesData.js
  const frontendFilePath = path.join(__dirname, '../frontend/src/data/realPlacesData.js');
  const fileContent = `// Bộ dữ liệu ${allPlaces.length} địa điểm thực tế trên toàn quốc với 30-50 đánh giá & bình luận cấp 2\nexport const REAL_PLACES_DATA = ${JSON.stringify(allPlaces, null, 2)};\n`;
  fs.writeFileSync(frontendFilePath, fileContent, 'utf8');
  console.log(`Successfully wrote ${allPlaces.length} places to ${frontendFilePath}`);

  // 3. Cập nhật vào MongoDB Atlas
  console.log('Connecting to MongoDB Atlas to update places collection...');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const placesCol = db.collection('places');

    // Xóa bộ sưu tập cũ và insert bộ sưu tập mới
    console.log('Clearing old places in MongoDB Atlas...');
    await placesCol.deleteMany({});

    console.log(`Inserting ${allPlaces.length} places with rich reviews into MongoDB Atlas...`);
    // Chuyển đổi định dạng cho MongoDB
    const docsToInsert = allPlaces.map(p => {
      const doc = { ...p };
      delete doc.id; // Để MongoDB tự sinh _id hoặc dùng id
      doc._id = new ObjectId();
      return doc;
    });

    const result = await placesCol.insertMany(docsToInsert);
    console.log(`Successfully inserted ${result.insertedCount} places into MongoDB Atlas!`);
  } catch (err) {
    console.error('MongoDB Atlas update error:', err.message);
  } finally {
    await client.close();
  }

  console.log('=== RICH DATA GENERATION COMPLETED SUCCESSFULLY ===');
}

run();
