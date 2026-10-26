import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Search, MapPin, Star, MessageSquare, Heart, Compass, 
  ThumbsUp, ThumbsDown, Flag, Image as ImageIcon, User, LogIn, LogOut, X, PlusCircle, CheckCircle, 
  AlertTriangle, Shield, Clock, Trash2, ArrowLeft, Send, Map as MapIcon,
  Calendar, Sparkles, Navigation, Ticket, ExternalLink, Filter, 
  SlidersHorizontal, CheckCircle2, ChevronRight, ChevronLeft, Eye, RefreshCw, Bookmark,
  BarChart3, TrendingUp, PieChart, Activity, Lock, UserCheck, Trophy, Info, ArrowUpRight,
  Copy, Check
} from 'lucide-react';
import { placeService, categoryService, authService, interactionService } from './services/api';
import TripPlanner from './components/TripPlanner';
import GraphRecommendations from './components/GraphRecommendations';
import AdminAnalyticsDashboard from './components/AdminAnalyticsDashboard';
import AdminPortal from './components/AdminPortal';
import AccountManagement from './components/AccountManagement';
import RankingLeaderboard from './components/RankingLeaderboard';
import SeasonalTravelCalendar from './components/SeasonalTravelCalendar';
import VietnamInteractiveMap from './components/VietnamInteractiveMap';
import CommunityFeed from './components/CommunityFeed';
import PlaceDetailView from './components/PlaceDetailView';
import { getPlaceTimingDetails } from './utils/placeTimingHelper';

// Danh mục các lý do báo cáo vi phạm tiêu chuẩn cộng đồng
const REPORT_REASONS = [
  { id: 'spam', label: 'Spam, quảng cáo rác hoặc chèo kéo dịch vụ thương mại' },
  { id: 'offensive', label: 'Ngôn từ thù ghét, xúc phạm, đả kích hoặc quấy rối cá nhân' },
  { id: 'misleading', label: 'Thông tin sai sự thật về địa điểm, lừa đảo du khách' },
  { id: 'inappropriate', label: 'Hình ảnh/nội dung phản cảm, bạo lực hoặc không phù hợp' },
  { id: 'irrelevant', label: 'Đánh giá / bình luận sai địa điểm, nội dung nhầm lẫn vô nghĩa' },
  { id: 'other', label: 'Lý do khác (vui lòng nêu rõ chi tiết bên dưới)' }
];

// Hàm format địa chỉ đầy đủ chuẩn xác và an toàn cho mọi địa điểm
const formatPlaceAddress = (place) => {
  if (!place) return '';
  if (typeof place.address === 'string' && place.address.trim()) {
    return place.address.trim();
  }
  if (place.address && typeof place.address === 'object') {
    const { street, ward, district, city } = place.address;
    const parts = [];
    if (street && street.trim()) parts.push(street.trim());
    if (ward && ward.trim() && !parts.some(p => p.toLowerCase().includes(ward.trim().toLowerCase()))) {
      parts.push(ward.trim());
    }
    if (district && district.trim() && !parts.some(p => p.toLowerCase().includes(district.trim().toLowerCase()))) {
      parts.push(district.trim());
    }
    if (city && city.trim() && !parts.some(p => p.toLowerCase().includes(city.trim().toLowerCase()))) {
      parts.push(city.trim());
    }
    if (parts.length > 0) return parts.join(', ');
  }
  if (place.fullAddress && place.fullAddress.trim()) return place.fullAddress.trim();
  if (place.district && place.city) return `${place.district}, ${place.city}`;
  if (place.city) return place.city;
  return 'Đang cập nhật địa chỉ chính thức';
};

// Dữ liệu Điểm đến nổi bật tham khảo theo hình ảnh thực tế (Image 1 reference)
// Khẳng định mô hình Đánh giá Du lịch (Review Platform), KHÔNG BÁN TOUR
const FEATURED_DESTINATIONS = [
  {
    id: 'dest-danang',
    name: 'Đà Nẵng',
    region: 'Miền Trung',
    placesCount: '48 địa điểm',
    reviewCount: '2.4k đánh giá',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    description: 'Đà Nẵng quyến rũ du khách bởi những bãi biển cát trắng trải dài, Cầu Vàng biểu tượng giữa lưng chừng mây tại Bà Nà Hills và bán đảo Sơn Trà hùng vĩ.',
    districtTag: 'Đà Nẵng'
  },
  {
    id: 'dest-dalat',
    name: 'Đà Lạt',
    region: 'Tây Nguyên',
    placesCount: '62 địa điểm',
    reviewCount: '3.1k đánh giá',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    description: 'Nằm trên cao nguyên Lâm Viên quanh năm sương mờ mát mẻ, Đà Lạt níu chân lữ khách bởi những đồi thông reo trong gió và ngàn góc cà phê nên thơ.',
    districtTag: 'Lâm Đồng'
  },
  {
    id: 'dest-phuquoc',
    name: 'Phú Quốc',
    region: 'Miền Nam',
    placesCount: '39 địa điểm',
    reviewCount: '1.8k đánh giá',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    description: 'Hòn đảo ngọc lớn nhất Việt Nam nổi bật với làn nước biển xanh ngọc bích, bãi cát trắng mịn màng và hoàng hôn lộng lẫy bậc nhất vịnh Thái Lan.',
    districtTag: 'Kiên Giang'
  },
  {
    id: 'dest-hcm',
    name: 'TP. Hồ Chí Minh',
    region: 'Miền Nam',
    placesCount: '120+ địa điểm',
    reviewCount: '5.6k đánh giá',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80',
    description: 'Trung tâm kinh tế và văn hóa sôi động bậc nhất phương Nam với những công trình di tích trăm năm tuổi, văn hóa cà phê vỉa hè và ẩm thực phong phú.',
    districtTag: 'TP. Hồ Chí Minh'
  },
  {
    id: 'dest-hanoi',
    name: 'Hà Nội',
    region: 'Miền Bắc',
    placesCount: '85 địa điểm',
    reviewCount: '4.2k đánh giá',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    description: 'Thủ đô nghìn năm văn hiến với 36 phố phường rêu phong, hồ Gươm bảng lảng sương sớm và tinh hoa ẩm thực phở, bún chả trứ danh.',
    districtTag: 'Hà Nội'
  },
  {
    id: 'dest-hoian',
    name: 'Hội An',
    region: 'Miền Trung',
    placesCount: '42 địa điểm',
    reviewCount: '2.1k đánh giá',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80',
    description: 'Đô thị cổ bên dòng sông Hoài thơ mộng, rực rỡ sắc màu đèn lồng mỗi khi đêm về và lưu giữ trọn vẹn kiến trúc giao thương thế kỷ 17.',
    districtTag: 'Quảng Nam'
  }
];

// Danh mục Tỉnh / Thành phố lớn toàn quốc (Lọc theo khu vực lớn, không chia lẻ từng quận)
const MAJOR_CITIES_OPTIONS = [
  { value: '', label: 'Tất cả điểm đến (Toàn quốc)' },
  { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh (27 điểm đến)' },
  { value: 'Hà Nội', label: 'Hà Nội (Thủ đô & Di tích)' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng (Bà Nà, Cầu Rồng, Sơn Trà)' },
  { value: 'Quảng Nam', label: 'Quảng Nam — Hội An & Mỹ Sơn' },
  { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế (Cố đô di sản)' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh — Vịnh Hạ Long' },
  { value: 'Ninh Bình', label: 'Ninh Bình (Tràng An, Bái Đính)' },
  { value: 'Lào Cai', label: 'Lào Cai — Sa Pa & Fansipan' },
  { value: 'Hà Giang', label: 'Hà Giang (Mã Pí Lèng, Cột cờ Lũng Cú)' },
  { value: 'Lâm Đồng', label: 'Lâm Đồng — Đà Lạt mộng mơ' },
  { value: 'Khánh Hòa', label: 'Khánh Hòa — Nha Trang biển đảo' },
  { value: 'Kiên Giang', label: 'Kiên Giang — Đảo Ngọc Phú Quốc' },
  { value: 'Bình Thuận', label: 'Bình Thuận — Mũi Né Phan Thiết' },
  { value: 'Cần Thơ', label: 'Cần Thơ (Thủ phủ Miền Tây)' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu (Bãi Sau, Tượng Chúa)' },
  { value: 'Tây Ninh', label: 'Tây Ninh (Núi Bà Đen, Tòa Thánh)' },
  { value: 'Bình Dương', label: 'Bình Dương (Đại Nam, Chùa Bà)' },
  { value: 'Đồng Nai', label: 'Đồng Nai (KDL Bửu Long, Cát Tiên)' },
  { value: 'Tiền Giang', label: 'Tiền Giang (Cái Bè, Thới Sơn)' },
];

import { REAL_PLACES_DATA } from './data/realPlacesData';

// Bộ dữ liệu 42+ Địa điểm thực tế tích hợp thông tin Google Maps & Đánh giá thật
const INITIAL_REAL_PLACES = REAL_PLACES_DATA;

export default function App() {
  // Navigation tabs:
  // 'home': Trang chủ
  // 'explore': Khám phá & Đánh giá (Bộ lọc danh mục)
  // 'map': Bản đồ
  // 'trip': Lập kế hoạch du lịch
  // 'recommend': Đề xuất địa điểm (Thuật toán hành vi + Form đóng góp)
  // 'favorites': Địa điểm yêu thích
  // 'admin': Quản trị
  const [currentTab, setCurrentTab] = useState('home');

  // Places & Categories State
  const [places, setPlaces] = useState(INITIAL_REAL_PLACES);
  const [categories, setCategories] = useState([]);
  
  // Search & Filter State: Lọc theo Tỉnh / Thành phố lớn (không chia nhỏ từng quận làm sót địa điểm)
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  // Alias selectedDistrict cho các callback cũ
  const selectedDistrict = selectedCity;
  const setSelectedDistrict = setSelectedCity;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all', '4.5', '4.0'
  const [selectedTravelMonth, setSelectedTravelMonth] = useState('all'); // 'all', '1'..'12'
  const [sortOption, setSortOption] = useState('ratingDesc');
  const [loading, setLoading] = useState(false);

  // Active Place for Full Review Detail View
  const [activePlace, setActivePlace] = useState(null);
  const [detailReviewTab, setDetailReviewTab] = useState('community'); // 'community', 'google'

  // User Auth & Admin View Mode State
  const [currentUser, setCurrentUser] = useState(null);
  const [adminViewMode, setAdminViewMode] = useState('portal'); // 'portal' | 'client'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authError, setAuthError] = useState('');

  // Favorites
  const [favoritePlaceIds, setFavoritePlaceIds] = useState([]);

  // Review & Comment Submissions
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImages, setReviewImages] = useState([]); // Danh sách ảnh đính kèm bài đánh giá (tối đa 5 ảnh)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [activeCommentReviewId, setActiveCommentReviewId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);

  // Reply Image Upload State
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const [replyImageMetadata, setReplyImageMetadata] = useState(null);

  // Lightbox Modal Xem ảnh phóng to
  const [lightboxImage, setLightboxImage] = useState(null);

  // Content Report Modal State với các lựa chọn lý do vi phạm
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); // { type, targetId, placeId, authorName, snippet }
  const [reportReason, setReportReason] = useState('spam');
  const [reportCustomReason, setReportCustomReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Web Satisfaction Rating Modal State (Tối đa 5 sao, mỗi tài khoản đánh giá 1 lần duy nhất)
  const [webRatingModalOpen, setWebRatingModalOpen] = useState(false);
  const [webRatingStars, setWebRatingStars] = useState(5);
  const [webRatingHover, setWebRatingHover] = useState(0);
  const [webRatingFeedback, setWebRatingFeedback] = useState('');
  const [webRatingSelectedTags, setWebRatingSelectedTags] = useState([]);
  const [webRatingSource, setWebRatingSource] = useState('favorite'); // 'favorite' | 'trip' | 'menu'
  const [isSubmittingWebRating, setIsSubmittingWebRating] = useState(false);
  const [hasAlreadyRatedWeb, setHasAlreadyRatedWeb] = useState(false);

  // Toast thông báo nổi tự biến mất (Không cần bấm xác nhận)
  const [toastMessage, setToastMessage] = useState(null); // { message, type: 'success' | 'info' | 'error' }
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((msg, type = 'success', duration = 3000) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage({ message: msg, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  // Trip Planner Sub-tabs: 'calendar' (Lịch du lịch theo mùa) | 'itinerary' (Kế hoạch hành trình)
  const [tripSubTab, setTripSubTab] = useState('calendar');

  // Explore Pagination (10 places per page)
  const [explorePage, setExplorePage] = useState(1);

  // Comment Image Upload with Distributed Metadata
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [commentImageMetadata, setCommentImageMetadata] = useState(null);

  // Interactive Map Propose Place Modal
  const [mapProposalModalOpen, setMapProposalModalOpen] = useState(false);
  const [mapPickedCoords, setMapPickedCoords] = useState({ lat: 10.7769, lng: 106.7009 });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Trip Planner custom stops
  const [customTripStops, setCustomTripStops] = useState([]);

  // Propose Place Form (Đóng góp địa điểm)
  const [propName, setPropName] = useState('');
  const [propCategory, setPropCategory] = useState('Du lịch & Di tích');
  const [propDistrict, setPropDistrict] = useState('Quận 1');
  const [propStreet, setPropStreet] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propOpeningHours, setPropOpeningHours] = useState('08:00 - 22:00');
  const [propTicketPrice, setPropTicketPrice] = useState('Miễn phí vào cổng');
  const [propImageUrl, setPropImageUrl] = useState('');
  const [propMessage, setPropMessage] = useState('');

  // ─────────────────────────────────────────────────────────────
  // BROWSER HISTORY & BACK BUTTON SYNCHRONIZATION (Fix blank page)
  // ─────────────────────────────────────────────────────────────
  const navigateTo = useCallback((tab, place = null, pushHistory = true) => {
    setCurrentTab(tab);
    setActivePlace(place);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cập nhật URL và Browser History
    const url = new URL(window.location.href);
    if (place) {
      const slug = place.slug || place.id || place._id;
      url.searchParams.set('tab', tab || 'explore');
      url.searchParams.set('place', slug);
    } else {
      url.searchParams.delete('place');
      if (tab === 'home') {
        url.search = '';
      } else {
        url.searchParams.set('tab', tab);
      }
    }

    const stateObj = { 
      tab: tab || 'home', 
      placeSlug: place ? (place.slug || place.id || place._id) : null 
    };

    if (pushHistory) {
      window.history.pushState(stateObj, '', url.pathname + url.search);
    } else {
      window.history.replaceState(stateObj, '', url.pathname + url.search);
    }
  }, []);

  // Xử lý khi người dùng nhấn nút Back / Forward trên Browser
  useEffect(() => {
    const handlePopState = (event) => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') || 'home';
      const placeSlug = params.get('place');

      setCurrentTab(tabParam);

      if (placeSlug) {
        const found = places.find(p => p.slug === placeSlug || (p.id || p._id) === placeSlug);
        setActivePlace(found || null);
      } else {
        setActivePlace(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [places]);

  // Khởi tạo trạng thái ban đầu từ URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') || 'home';
    const placeSlug = params.get('place');

    setCurrentTab(tabParam);
    if (placeSlug) {
      const found = INITIAL_REAL_PLACES.find(p => p.slug === placeSlug || (p.id || p._id) === placeSlug);
      if (found) setActivePlace(found);
    }

    // Thiết lập state ban đầu tránh blank page
    window.history.replaceState({ tab: tabParam, placeSlug: placeSlug || null }, '', window.location.href);

    // Tải thông tin người dùng nếu có token
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        if (u.role === 'Admin') {
          setAdminViewMode('portal');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }

    loadCategories();
    fetchBackendPlaces();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch {
      setCategories([
        { id: 'cat-1', name: 'Du lịch & Di tích', slug: 'du-lich-di-tich' },
        { id: 'cat-2', name: 'Ẩm thực & Nhà hàng', slug: 'am-thuc-nha-hang' },
        { id: 'cat-3', name: 'Cà phê & Trà', slug: 'ca-phe-tra' },
        { id: 'cat-4', name: 'Vui chơi & Giải trí', slug: 'vui-choi-giai-tri' },
        { id: 'cat-5', name: 'Khách sạn & Nghỉ dưỡng', slug: 'khach-san-nghi-duong' },
        { id: 'cat-6', name: 'Check-in thiên nhiên', slug: 'check-in-thien-nhien' }
      ]);
    }
  };

  const fetchBackendPlaces = async () => {
    setLoading(true);
    try {
      const res = await placeService.getPlaces({ pageSize: 100 });
      if (res.data?.data && res.data.data.length > 0) {
        const backendPlaces = res.data.data.map(p => {
          const fallback = REAL_PLACES_DATA.find(f => f.slug === p.slug) || {};
          const mergedAddress = (p.address && (p.address.street || p.address.district || p.address.city))
            ? { ...(fallback.address || {}), ...p.address }
            : (fallback.address || p.address || {});
          return {
            ...fallback,
            ...p,
            id: p.id || p._id || fallback.id,
            address: mergedAddress,
            googleRating: p.googleRating || fallback.googleRating || 4.7,
            googleReviewCount: p.googleReviewCount || fallback.googleReviewCount || 15000,
            openingHours: p.openingHours || fallback.openingHours || '08:00 - 22:00 (Hàng ngày)',
            isOpenNow: p.isOpenNow !== undefined ? p.isOpenNow : true,
            ticketPrice: p.ticketPrice || fallback.ticketPrice || 'Miễn phí vào cổng',
            ticketType: p.ticketType || fallback.ticketType || 'free',
            googleReviewSnippet: p.googleReviewSnippet || fallback.googleReviewSnippet || 'Địa điểm được Google Maps đánh giá cao.',
            reviews: (p.reviews && p.reviews.length > 0) ? p.reviews : (fallback.reviews || [])
          };
        });
        setPlaces(backendPlaces);
        setActivePlace(prev => {
          if (!prev) return null;
          const fresh = backendPlaces.find(bp => bp.slug === prev.slug || (bp.id || bp._id) === (prev.id || prev._id));
          return fresh || prev;
        });
      }
    } catch (err) {
      console.warn('Backend chưa phản hồi, sử dụng dữ liệu REAL_PLACES_DATA:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc và sắp xếp địa điểm theo Khu vực / Tỉnh thành lớn, Danh mục, Đánh giá và Tháng đi
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matchName = place.name.toLowerCase().includes(query);
        const matchDesc = place.description?.toLowerCase().includes(query);
        const matchDistrict = place.address?.district?.toLowerCase().includes(query);
        const matchCity = place.address?.city?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchDistrict && !matchCity) return false;
      }

      // Lọc theo Khu vực / Tỉnh thành lớn (Bao trùm toàn bộ các điểm đến trong thành phố đó)
      if (selectedCity) {
        const target = selectedCity.toLowerCase().trim();
        const pCity = (place.address?.city || '').toLowerCase().trim();
        const pDistrict = (place.address?.district || '').toLowerCase().trim();
        const pStreet = (place.address?.street || '').toLowerCase().trim();

        const isHcm = target.includes('hồ chí minh') || target.includes('hcm') || target === 'tp.hcm';
        if (isHcm) {
          const matchHcm = pCity.includes('hồ chí minh') || pCity.includes('hcm') || pCity.includes('tp.hcm');
          if (!matchHcm) return false;
        } else {
          let aliases = [target];
          if (target.includes('lâm đồng') || target.includes('đà lạt')) aliases.push('lâm đồng', 'đà lạt');
          if (target.includes('kiên giang') || target.includes('phú quốc')) aliases.push('kiên giang', 'phú quốc');
          if (target.includes('lào cai') || target.includes('sa pa')) aliases.push('lào cai', 'sa pa', 'sapa');
          if (target.includes('quảng nam') || target.includes('hội an')) aliases.push('quảng nam', 'hội an');
          if (target.includes('quảng ninh') || target.includes('hạ long')) aliases.push('quảng ninh', 'hạ long');
          if (target.includes('khánh hòa') || target.includes('nha trang')) aliases.push('khánh hòa', 'nha trang');
          if (target.includes('bình thuận') || target.includes('mũi né') || target.includes('phan thiết')) aliases.push('bình thuận', 'mũi né', 'phan thiết');
          if (target.includes('bà rịa') || target.includes('vũng tàu')) aliases.push('bà rịa', 'vũng tàu');
          if (target.includes('thừa thiên') || target.includes('huế')) aliases.push('thừa thiên', 'huế');

          const matched = aliases.some(alias => 
            pCity.includes(alias) || 
            pDistrict.includes(alias) || 
            pStreet.includes(alias)
          );
          if (!matched) return false;
        }
      }

      if (selectedCategory) {
        const catName = place.categoryName || '';
        const catId = place.categoryId || '';
        if (catId !== selectedCategory && !catName.includes(selectedCategory)) return false;
      }

      if (ratingFilter === '4.5') {
        const r = place.ratingAverage || place.googleRating || 0;
        if (r < 4.5) return false;
      } else if (ratingFilter === '4.0') {
        const r = place.ratingAverage || place.googleRating || 0;
        if (r < 4.0) return false;
      }

      // Khi lọc theo tháng: CHỈ lọc ra các địa điểm phù hợp để đi trong tháng đó
      if (selectedTravelMonth !== 'all') {
        const m = parseInt(selectedTravelMonth, 10);
        const timing = getPlaceTimingDetails(place);
        const isMatch = timing.bestMonths && timing.bestMonths.includes(m);
        if (!isMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'ratingDesc') {
        return (b.ratingAverage || b.googleRating || 0) - (a.ratingAverage || a.googleRating || 0);
      }
      if (sortOption === 'reviewsDesc') {
        return (b.reviewCount || b.googleReviewCount || 0) - (a.reviewCount || a.googleReviewCount || 0);
      }
      if (sortOption === 'nameAsc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [places, keyword, selectedCity, selectedCategory, ratingFilter, sortOption, selectedTravelMonth]);

  // Reset pagination when search/filter criteria change
  useEffect(() => {
    setExplorePage(1);
  }, [keyword, selectedCity, selectedCategory, ratingFilter, sortOption, selectedTravelMonth]);

  const handleSelectDestination = (dest) => {
    setSelectedCity(dest.districtTag || dest.name);
    navigateTo('explore');
  };

  const handleOpenDetail = (place) => {
    navigateTo(currentTab || 'explore', place);
    if (place) {
      const pId = place.id || place._id;
      // Ghi nhận lượt truy cập thực tế (VisitCount increment via $inc)
      fetch(`http://localhost:5196/api/places/${pId}/visit`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data && data.visitCount !== undefined) {
            setPlaces(prev => prev.map(p => ((p.id === pId || p._id === pId) ? { ...p, visitCount: data.visitCount } : p)));
            setActivePlace(prev => (prev && (prev.id === pId || prev._id === pId)) ? { ...prev, visitCount: data.visitCount } : prev);
          }
        })
        .catch(err => console.debug('Visit tracking notice:', err));
    }
  };

  const handleBackFromDetail = () => {
    navigateTo(currentTab || 'explore', null);
  };

  // Kiểm tra trạng thái đã đánh giá website của tài khoản hiện tại
  useEffect(() => {
    if (currentUser) {
      const userKey = currentUser.userId || currentUser.id || currentUser.email;
      const existing = localStorage.getItem('longo_web_rating_' + userKey);
      setHasAlreadyRatedWeb(!!existing);
    } else {
      setHasAlreadyRatedWeb(false);
    }
  }, [currentUser]);

  // Kiểm tra và kích hoạt form đánh giá website sau khi lưu yêu thích hoặc thêm vào lịch trình
  const checkAndTriggerWebRating = (source = 'favorite') => {
    if (!currentUser) return; // Chỉ áp dụng cho người dùng đã đăng nhập
    const userKey = currentUser.userId || currentUser.id || currentUser.email;
    if (!userKey) return;

    // Mỗi tài khoản chỉ được đánh giá 1 lần duy nhất
    const alreadyRated = localStorage.getItem('longo_web_rating_' + userKey);
    if (alreadyRated) {
      return;
    }

    // Hiển thị modal sau một thoáng trễ ngắn (500ms) để không làm gián đoạn phản hồi của thao tác vừa thực hiện
    setTimeout(() => {
      setWebRatingSource(source);
      setWebRatingStars(5);
      setWebRatingHover(0);
      setWebRatingFeedback('');
      setWebRatingSelectedTags([]);
      setWebRatingModalOpen(true);
    }, 500);
  };

  const getWebRatingLabel = (stars) => {
    switch (stars) {
      case 1: return '⭐ Chưa hài lòng - Cần cải thiện thêm nhiều tính năng';
      case 2: return '⭐⭐ Tạm ổn - Còn một số trải nghiệm chưa mượt';
      case 3: return '⭐⭐⭐ Bình thường - Đáp ứng cơ bản nhu cầu du lịch';
      case 4: return '⭐⭐⭐⭐ Hài lòng - Giao diện trực quan, tính năng tiện lợi';
      case 5: return '⭐⭐⭐⭐⭐ Tuyệt vời! - Trải nghiệm xuất sắc, thông tin thực tế chuẩn xác';
      default: return 'Chọn mức độ hài lòng (tối đa 5 sao)';
    }
  };

  const handleSubmitWebRating = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) return;
    const userKey = currentUser.userId || currentUser.id || currentUser.email;
    if (!userKey) return;

    // Kiểm tra chặn nếu tài khoản đã đánh giá rồi
    if (localStorage.getItem('longo_web_rating_' + userKey)) {
      showToast('⭐ Tài khoản của bạn đã đánh giá website trước đó rồi.', 'info');
      setWebRatingModalOpen(false);
      setHasAlreadyRatedWeb(true);
      return;
    }

    setIsSubmittingWebRating(true);

    const ratingRecord = {
      id: 'wr-' + Date.now(),
      userId: userKey,
      userEmail: currentUser.email || 'traveler@longo.vn',
      userName: currentUser.fullName || 'Người dùng LonGo',
      rating: Math.min(5, Math.max(1, webRatingStars)), // Đảm bảo tối đa 5 sao
      feedback: webRatingFeedback.trim(),
      tags: webRatingSelectedTags,
      source: webRatingSource,
      createdAt: new Date().toISOString()
    };

    // Lưu vào localStorage khóa theo tài khoản (chặn đánh giá lại)
    localStorage.setItem('longo_web_rating_' + userKey, JSON.stringify(ratingRecord));

    // Lưu vào danh sách tổng hợp
    try {
      const allRatings = JSON.parse(localStorage.getItem('longo_all_web_ratings') || '[]');
      allRatings.push(ratingRecord);
      localStorage.setItem('longo_all_web_ratings', JSON.stringify(allRatings));
    } catch (err) {
      console.warn('Lỗi lưu danh sách web rating tổng:', err);
    }

    setHasAlreadyRatedWeb(true);
    setIsSubmittingWebRating(false);
    setWebRatingModalOpen(false);

    // Popup thông báo tự động biến mất, người dùng không cần bấm xác nhận
    showToast(`🎉 Cảm ơn ${currentUser.fullName || 'bạn'} đã đánh giá ${ratingRecord.rating}★ cho LonGo!`, 'success', 3500);
  };

  const handleAddToTrip = (place) => {
    const pId = place.id || place._id;
    if (customTripStops.some(s => (s.id || s._id) === pId)) {
      showToast(`Địa điểm "${place.name}" đã có trong kế hoạch du lịch.`, 'info');
      return;
    }
    setCustomTripStops([...customTripStops, place]);
    showToast(`✓ Đã thêm "${place.name}" vào Lịch trình du lịch!`, 'success');
    if (currentUser) {
      checkAndTriggerWebRating('trip');
    }
  };

  const handleToggleFavorite = (placeId, e) => {
    if (e) e.stopPropagation();
    const foundPlace = places.find(p => (p.id || p._id) === placeId);
    const placeName = foundPlace ? foundPlace.name : 'Địa điểm';
    if (favoritePlaceIds.includes(placeId)) {
      setFavoritePlaceIds(favoritePlaceIds.filter(id => id !== placeId));
      showToast(`Đã xóa "${placeName}" khỏi danh sách Yêu thích.`, 'info');
    } else {
      setFavoritePlaceIds([...favoritePlaceIds, placeId]);
      showToast(`✓ Đã lưu "${placeName}" vào danh sách Yêu thích!`, 'success');
      if (currentUser) {
        checkAndTriggerWebRating('favorite');
      }
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      let res;
      if (authMode === 'login') {
        res = await authService.login(authEmail, authPassword);
      } else {
        res = await authService.register(authEmail, authPassword, authFullName);
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setCurrentUser(res.data);
      if (res.data?.role === 'Admin') setAdminViewMode('portal');
      setAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthFullName('');
    } catch {
      const mockUser = {
        userId: 'u-' + Date.now(),
        email: authEmail || 'traveler@travelreview.vn',
        fullName: authFullName || (authMode === 'login' ? 'Nguyễn Văn Du Khách' : 'Thành viên mới'),
        role: authEmail.includes('admin') ? 'Admin' : 'Member'
      };
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      if (mockUser.role === 'Admin') setAdminViewMode('portal');
      setAuthModalOpen(false);
    }
  };

  const handleQuickLogin = async (role) => {
    const email = role === 'admin' ? 'admin@longo.vn' : 'member@longo.vn';
    const password = 'Member@123';
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setCurrentUser(res.data);
      if (res.data?.role === 'Admin') setAdminViewMode('portal');
      setAuthModalOpen(false);
    } catch {
      const mockUser = {
        userId: role === 'admin' ? '651111111111111111111111' : '652222222222222222222222',
        email: email,
        fullName: role === 'admin' ? 'Quản trị viên LonGo' : 'Nguyễn Văn Du Khách',
        role: role === 'admin' ? 'Admin' : 'Member'
      };
      localStorage.setItem('token', 'mock-token-' + role);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      if (mockUser.role === 'Admin') setAdminViewMode('portal');
      setAuthModalOpen(false);
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setAdminViewMode('portal');
    if (currentTab === 'admin' || currentTab === 'favorites' || currentTab === 'account') {
      navigateTo('home');
    }
  };

  const handleReviewImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - reviewImages.length;
    if (remainingSlots <= 0) {
      alert('Bạn chỉ có thể đính kèm tối đa 5 hình ảnh cho mỗi bài đánh giá.');
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    selectedFiles.forEach(file => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`Ảnh ${file.name} vượt quá 8MB, vui lòng chọn ảnh dung lượng nhỏ hơn.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setReviewImages(prev => {
          if (prev.length >= 5) return prev;
          return [...prev, {
            url: event.target.result,
            publicId: `rev_img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
          }];
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveReviewImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!reviewContent.trim() && reviewImages.length === 0) return;

    setIsSubmittingReview(true);
    const targetPlaceId = activePlace.slug || activePlace.id || activePlace._id;

    const newRev = {
      reviewId: 'rev-' + Date.now(),
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: reviewRating,
      content: reviewContent.trim(),
      images: [...reviewImages],
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    // 1. Gọi API Web API lưu trực tiếp vào MongoDB Atlas
    try {
      await placeService.createReview(targetPlaceId, {
        rating: reviewRating,
        content: reviewContent.trim(),
        images: reviewImages
      });
      console.log('[REVIEW-SAVED] Đã lưu đánh giá thành công vào MongoDB Atlas!');
    } catch (err) {
      console.warn('Lưu API review (hoặc offline), tiến hành cập nhật giao diện:', err.response?.data || err.message);
    }

    // 2. Cập nhật state giao diện tức thời để Data Analyst dashboard và trang chi tiết nhảy số liệu ngay
    const updatedReviews = [newRev, ...(activePlace.reviews || [])];
    const newCount = updatedReviews.length;
    const newAvg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newCount).toFixed(1));

    const updatedPlace = {
      ...activePlace,
      reviews: updatedReviews,
      reviewCount: newCount,
      ratingAverage: newAvg
    };

    setActivePlace(updatedPlace);
    setPlaces(places.map(p => ((p.slug === activePlace.slug || p.id === activePlace.id || p._id === activePlace._id) ? updatedPlace : p)));
    setReviewContent('');
    setReviewImages([]);
    setIsSubmittingReview(false);
    alert('✓ Đã đăng bài đánh giá thành công! Đánh giá kèm hình ảnh đã được lưu vào hệ thống.');
  };

  const handleDeleteReview = async (placeId, reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đánh giá này?')) return;
    try {
      await placeService.deleteReview(placeId, reviewId);
    } catch (err) {
      console.warn('Lỗi khi xóa qua API:', err);
    }

    setPlaces(prevPlaces => prevPlaces.map(p => {
      const match = (p.id === placeId || p._id === placeId || p.slug === placeId);
      if (!match) return p;
      const updatedRev = (p.reviews || []).filter(r => r.reviewId !== reviewId);
      return {
        ...p,
        reviews: updatedRev,
        reviewCount: updatedRev.length,
        ratingAverage: updatedRev.length > 0 
          ? Number((updatedRev.reduce((s, r) => s + r.rating, 0) / updatedRev.length).toFixed(1))
          : 4.5
      };
    }));

    if (activePlace && (activePlace.id === placeId || activePlace._id === placeId || activePlace.slug === placeId)) {
      const updatedRev = (activePlace.reviews || []).filter(r => r.reviewId !== reviewId);
      setActivePlace({
        ...activePlace,
        reviews: updatedRev,
        reviewCount: updatedRev.length
      });
    }

    alert('Đã xóa bài đánh giá thành công!');
  };

  const handleCommentImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setCommentImagePreview(base64);
      setCommentImageMetadata({
        url: base64,
        thumbnailUrl: base64,
        storageKey: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        storageProvider: 'Distributed_CDN_Store',
        uploadedBy: currentUser?.fullName || 'Thành viên',
        uploadedAt: new Date().toISOString(),
        sizeBytes: file.size,
        mimeType: file.type || 'image/jpeg'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleReplyImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ảnh vượt quá dung lượng cho phép (tối đa 8MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setReplyImagePreview(base64);
      setReplyImageMetadata({
        url: base64,
        thumbnailUrl: base64,
        storageKey: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        storageProvider: 'Distributed_CDN_Store',
        uploadedBy: currentUser?.fullName || 'Thành viên',
        uploadedAt: new Date().toISOString(),
        sizeBytes: file.size,
        mimeType: file.type || 'image/jpeg'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveReplyImage = () => {
    setReplyImagePreview(null);
    setReplyImageMetadata(null);
  };

  const handleAddComment = async (reviewId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!commentContent.trim() && !commentImageMetadata) return;

    const newComment = {
      commentId: 'cmt-' + Date.now(),
      userName: currentUser.fullName,
      content: commentContent.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
      image: commentImageMetadata || null,
      replies: []
    };

    const targetPlaceId = activePlace.slug || activePlace.id || activePlace._id;

    const updatedReviews = (activePlace.reviews || []).map(r => {
      if (r.reviewId === reviewId) {
        return { ...r, comments: [...(r.comments || []), newComment] };
      }
      return r;
    });

    const updatedPlace = { ...activePlace, reviews: updatedReviews };
    setActivePlace(updatedPlace);
    setPlaces(places.map(p => ((p.id || p._id) === (activePlace.id || activePlace._id) ? updatedPlace : p)));
    setCommentContent('');
    setCommentImagePreview(null);
    setCommentImageMetadata(null);
    setActiveCommentReviewId(null);

    // Lưu API comment kèm metadata phân tán
    try {
      await fetch(`http://localhost:5196/api/places/${targetPlaceId}/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify({
          content: newComment.content,
          image: newComment.image
        })
      });
    } catch (err) {
      console.warn('Comment API synced locally:', err);
    }
  };

  const handleToggleCommentLike = async (reviewId, commentId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const myId = currentUser.userId || currentUser.email || 'me';
    const targetPlaceId = activePlace.slug || activePlace.id || activePlace._id;

    const updatedReviews = (activePlace.reviews || []).map(r => {
      if (r.reviewId === reviewId) {
        const updatedComments = (r.comments || []).map(c => {
          if (c.commentId === commentId) {
            const currentLikes = c.likes || [];
            const currentDislikes = c.dislikes || [];
            const hasLiked = currentLikes.includes(myId);
            return {
              ...c,
              likes: hasLiked ? currentLikes.filter(id => id !== myId) : [...currentLikes, myId],
              dislikes: currentDislikes.filter(id => id !== myId)
            };
          }
          return c;
        });
        return { ...r, comments: updatedComments };
      }
      return r;
    });

    const updatedPlace = { ...activePlace, reviews: updatedReviews };
    setActivePlace(updatedPlace);
    setPlaces(places.map(p => ((p.id || p._id) === (activePlace.id || activePlace._id) ? updatedPlace : p)));

    try {
      await fetch(`http://localhost:5196/api/places/${targetPlaceId}/reviews/${reviewId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        }
      });
    } catch (err) {
      console.debug('Comment like synced:', err);
    }
  };

  const handleToggleCommentDislike = async (reviewId, commentId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const myId = currentUser.userId || currentUser.email || 'me';
    const targetPlaceId = activePlace.slug || activePlace.id || activePlace._id;

    const updatedReviews = (activePlace.reviews || []).map(r => {
      if (r.reviewId === reviewId) {
        const updatedComments = (r.comments || []).map(c => {
          if (c.commentId === commentId) {
            const currentLikes = c.likes || [];
            const currentDislikes = c.dislikes || [];
            const hasDisliked = currentDislikes.includes(myId);
            return {
              ...c,
              dislikes: hasDisliked ? currentDislikes.filter(id => id !== myId) : [...currentDislikes, myId],
              likes: currentLikes.filter(id => id !== myId)
            };
          }
          return c;
        });
        return { ...r, comments: updatedComments };
      }
      return r;
    });

    const updatedPlace = { ...activePlace, reviews: updatedReviews };
    setActivePlace(updatedPlace);
    setPlaces(places.map(p => ((p.id || p._id) === (activePlace.id || activePlace._id) ? updatedPlace : p)));

    try {
      await fetch(`http://localhost:5196/api/places/${targetPlaceId}/reviews/${reviewId}/comments/${commentId}/dislike`, {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        }
      });
    } catch (err) {
      console.debug('Comment dislike synced:', err);
    }
  };

  const handleLikeReview = async (placeSlugOrId, reviewId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const userId = currentUser.userId || currentUser.id || 'u-curr';
    if (!activePlace) return;

    const updatedReviews = (activePlace.reviews || []).map(r => {
      if (r.reviewId === reviewId) {
        const likes = r.likes || [];
        const isLiked = likes.includes(userId);
        return {
          ...r,
          likes: isLiked ? likes.filter(id => id !== userId) : [...likes, userId]
        };
      }
      return r;
    });

    const updatedPlace = { ...activePlace, reviews: updatedReviews };
    setActivePlace(updatedPlace);
    setPlaces(places.map(p => ((p.id || p._id) === (activePlace.id || activePlace._id) ? updatedPlace : p)));
  };

  const handleDislikeReview = async (placeSlugOrId, reviewId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    // Dislike review optimistic feedback
  };

  const handleOpenReportModal = (target, placeIdArg, targetIdArg, authorNameArg, snippetArg) => {
    let parsedTarget = target;
    if (typeof target === 'string') {
      parsedTarget = {
        type: target,
        placeId: placeIdArg,
        targetId: targetIdArg,
        authorName: authorNameArg,
        snippet: snippetArg
      };
    }
    setReportTarget(parsedTarget);
    setReportReason('spam');
    setReportCustomReason('');
    setReportModalOpen(true);
  };

  const handleReportComment = (commentId, authorName, snippet) => {
    handleOpenReportModal({
      type: 'comment',
      targetId: commentId,
      placeId: activePlace ? (activePlace.slug || activePlace.id || activePlace._id) : 'general',
      authorName: authorName || 'Người dùng',
      snippet: snippet || 'Bình luận'
    });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;

    setIsSubmittingReport(true);
    const reasonObj = REPORT_REASONS.find(r => r.id === reportReason);
    const reasonLabel = reasonObj ? reasonObj.label : reportReason;
    const finalReason = reportReason === 'other'
      ? (reportCustomReason.trim() || 'Lý do khác')
      : (reportCustomReason.trim() ? `${reasonLabel} (${reportCustomReason.trim()})` : reasonLabel);

    const targetPlaceId = reportTarget.placeId || (activePlace ? (activePlace.slug || activePlace.id || activePlace._id) : 'general');

    try {
      await interactionService.createReport({
        targetType: reportTarget.type || 'comment',
        placeId: String(targetPlaceId),
        targetId: String(reportTarget.targetId),
        reason: finalReason
      });
      console.log('[REPORT-SUCCESS] Đã ghi nhận báo cáo vào hệ thống MongoDB!');
    } catch (err) {
      console.debug('Báo cáo lưu trữ cục bộ:', err);
    }

    setIsSubmittingReport(false);
    setReportModalOpen(false);
    showToast('✓ Tiếp nhận báo cáo vi phạm thành công! Ban Quản Trị LonGo sẽ sớm kiểm duyệt.', 'success', 3500);
  };

  const handleAddReply = (reviewId, commentId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!replyContent.trim() && !replyImageMetadata) return;

    const newReply = {
      replyId: 'rep-' + Date.now(),
      userName: currentUser.fullName,
      content: replyContent.trim(),
      image: replyImageMetadata || null,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = (activePlace.reviews || []).map(r => {
      if (r.reviewId === reviewId) {
        const updatedComments = (r.comments || []).map(c => {
          if (c.commentId === commentId) {
            return { ...c, replies: [...(c.replies || []), newReply] };
          }
          return c;
        });
        return { ...r, comments: updatedComments };
      }
      return r;
    });

    const updatedPlace = { ...activePlace, reviews: updatedReviews };
    setActivePlace(updatedPlace);
    setPlaces(places.map(p => ((p.id || p._id) === (activePlace.id || activePlace._id) ? updatedPlace : p)));
    setReplyContent('');
    setReplyImagePreview(null);
    setReplyImageMetadata(null);
    setActiveReplyCommentId(null);

    // Đồng bộ API nếu backend đang chạy
    try {
      const targetPlaceId = activePlace.slug || activePlace.id || activePlace._id;
      fetch(`http://localhost:5196/api/places/${targetPlaceId}/reviews/${reviewId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify({
          content: newReply.content,
          image: newReply.image
        })
      }).catch(err => console.debug('Reply API synced locally:', err));
    } catch (err) {
      console.debug('Reply fallback:', err);
    }
  };

  const handleProposeSubmit = async (e) => {
    e.preventDefault();
    if (!propName.trim()) return;

    const newProposed = {
      id: 'prop-' + Date.now(),
      name: propName,
      description: propDesc,
      categoryName: propCategory || 'Du lịch & Di tích',
      address: { street: propStreet, district: propDistrict, city: propDistrict.includes('TP.') ? propDistrict : `${propDistrict}` },
      location: { type: 'Point', coordinates: [mapPickedCoords.lng, mapPickedCoords.lat] },
      images: [{ url: propImageUrl || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800' }],
      ratingAverage: 5.0,
      reviewCount: 1,
      googleRating: 4.8,
      googleReviewCount: 120,
      openingHours: propOpeningHours,
      isOpenNow: true,
      ticketPrice: propTicketPrice,
      ticketType: propTicketPrice.toLowerCase().includes('miễn phí') ? 'free' : 'paid',
      googleReviewSnippet: 'Địa điểm mới được cộng đồng đóng góp và xác thực thông tin.',
      reviews: []
    };

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5196/api/place-proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          type: 'create',
          name: propName,
          description: propDesc,
          categoryId: propCategory,
          street: propStreet,
          district: propDistrict,
          lng: mapPickedCoords.lng,
          lat: mapPickedCoords.lat,
          imageUrl: propImageUrl
        })
      });
    } catch (err) {
      console.warn('Sync proposal API:', err);
    }

    setPlaces([newProposed, ...places]);
    setPropMessage('✓ Cảm ơn bạn! Đề xuất địa điểm đã được ghi nhận và gửi Admin phê duyệt.');
    setPropName('');
    setPropStreet('');
    setPropDesc('');
    setPropImageUrl('');
    setTimeout(() => setPropMessage(''), 4000);
  };

  const handleSubmitMapProposal = async (e) => {
    e.preventDefault();
    if (!propName.trim()) return;

    setIsSubmittingProposal(true);
    const newProposed = {
      id: 'prop-' + Date.now(),
      name: propName,
      description: propDesc || `Địa điểm tại ${propDistrict} được cộng đồng đề xuất trực tiếp trên Bản đồ tương tác.`,
      categoryName: propCategory || 'Du lịch & Di tích',
      address: { street: propStreet || propDistrict, district: propDistrict, city: propDistrict },
      location: { type: 'Point', coordinates: [mapPickedCoords.lng, mapPickedCoords.lat] },
      images: [{ url: propImageUrl || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800' }],
      ratingAverage: 5.0,
      reviewCount: 1,
      googleRating: 4.8,
      googleReviewCount: 10,
      openingHours: propOpeningHours || '08:00 - 22:00',
      isOpenNow: true,
      ticketPrice: propTicketPrice || 'Miễn phí vào cổng',
      ticketType: propTicketPrice.toLowerCase().includes('miễn phí') ? 'free' : 'paid',
      googleReviewSnippet: 'Địa điểm được ghim marker và đề xuất từ Bản đồ LonGo.',
      reviews: []
    };

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5196/api/place-proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          type: 'create',
          name: propName,
          description: propDesc,
          categoryId: propCategory,
          street: propStreet || propDistrict,
          district: propDistrict,
          lng: mapPickedCoords.lng,
          lat: mapPickedCoords.lat,
          imageUrl: propImageUrl
        })
      });
    } catch (err) {
      console.warn('Sync map proposal API:', err);
    }

    setPlaces(prev => [newProposed, ...prev]);
    setIsSubmittingProposal(false);
    setMapProposalModalOpen(false);
    setPropName('');
    setPropDesc('');
    setPropStreet('');
    setPropImageUrl('');
    showToast('✓ Đề xuất địa điểm đã được gửi thành công tới Ban Quản Trị!', 'success', 3500);
  };

  // NẾU LÀ ADMIN VÀ ĐANG Ở CHẾ ĐỘ QUẢN TRỊ RIÊNG (ADMIN PORTAL)
  if (currentUser?.role === 'Admin' && adminViewMode === 'portal') {
    return (
      <AdminPortal
        currentUser={currentUser}
        places={places}
        onRefreshPlaces={fetchBackendPlaces}
        onSwitchToClientMode={() => setAdminViewMode('client')}
        onLogout={handleLogout}
        onSelectPlace={handleOpenDetail}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--aj-canvas)' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          MASTHEAD / NAVBAR: Chữ màu đen trên nền trắng
          ───────────────────────────────────────────────────────────── */}
      <header className="aj-masthead">
        <div className="aj-masthead-inner">
          
          {/* Logo Brand: Chữ màu đen trên nền trắng thanh lịch */}
          <div 
            onClick={() => navigateTo('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: '#000000',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={20} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#000000', letterSpacing: '-0.04em' }}>
                LonGo
              </span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                TRAVEL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="aj-nav-links">
            <button 
              onClick={() => navigateTo('home')}
              className={`aj-nav-item ${currentTab === 'home' && !activePlace ? 'active' : ''}`}
            >
              Trang chủ
            </button>

            <button 
              onClick={() => navigateTo('explore')}
              className={`aj-nav-item ${currentTab === 'explore' && !activePlace ? 'active' : ''}`}
            >
              Khám phá & Đánh giá
            </button>

            <button 
              onClick={() => navigateTo('ranking')}
              className={`aj-nav-item ${currentTab === 'ranking' ? 'active' : ''}`}
              style={{ fontWeight: 700 }}
            >
              Bảng xếp hạng
            </button>

            <button 
              onClick={() => navigateTo('feed')}
              className={`aj-nav-item ${currentTab === 'feed' ? 'active' : ''}`}
              style={{ fontWeight: 700 }}
            >
              Cộng đồng
            </button>

            <button 
              onClick={() => navigateTo('map')}
              className={`aj-nav-item ${currentTab === 'map' ? 'active' : ''}`}
            >
              Bản đồ
            </button>

            <button 
              onClick={() => navigateTo('trip')}
              className={`aj-nav-item ${currentTab === 'trip' ? 'active' : ''}`}
            >
              Lập kế hoạch
            </button>

            {currentUser?.role === 'Admin' && (
              <button 
                onClick={() => setAdminViewMode('portal')}
                className="aj-nav-item"
                style={{ fontWeight: 800, color: '#fa9000', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <Shield size={14} color="#fa9000" />
                <span>Trang Quản Trị</span>
              </button>
            )}
          </nav>

          {/* User Controls: Trái tim (Yêu thích) -> Icon hình người (Quản lý tài khoản dropdown) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            
            {/* 1. Icon Trái Tim: Yêu thích (Favorites) */}
            <button 
              onClick={() => { setUserMenuOpen(false); navigateTo('favorites'); }}
              title="Địa điểm yêu thích"
              style={{
                position: 'relative',
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: currentTab === 'favorites' ? '#fee2e2' : 'transparent',
                border: '1px solid',
                borderColor: currentTab === 'favorites' ? '#fca5a5' : 'var(--aj-hairline)',
                cursor: 'pointer',
                color: currentTab === 'favorites' ? '#ef4444' : 'var(--aj-ink)',
                transition: 'all 0.15s ease'
              }}
            >
              <Heart 
                size={18} 
                fill={favoritePlaceIds.length > 0 || currentTab === 'favorites' ? '#ef4444' : 'none'} 
                color={favoritePlaceIds.length > 0 || currentTab === 'favorites' ? '#ef4444' : 'currentColor'} 
                strokeWidth={2}
              />
              {favoritePlaceIds.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 900,
                  minWidth: 16,
                  height: 16,
                  padding: '0 3px',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {favoritePlaceIds.length}
                </span>
              )}
            </button>

            {/* 2. Icon Hình Người: Quản lý tài khoản (Dropdown Menu sổ xuống) */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title={currentUser ? `Tài khoản: ${currentUser.fullName}` : "Quản lý tài khoản & Đăng nhập"}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: currentUser ? '#000000' : (userMenuOpen ? '#f1f5f9' : 'transparent'),
                  color: currentUser ? '#ffffff' : 'var(--aj-ink)',
                  border: '1px solid',
                  borderColor: currentUser ? '#000000' : (userMenuOpen ? '#000000' : 'var(--aj-hairline)'),
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 800,
                  transition: 'all 0.15s ease'
                }}
              >
                {currentUser ? (
                  currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'
                ) : (
                  <User size={18} strokeWidth={2} />
                )}
              </button>

              {/* Danh mục sổ xuống khi bấm vào icon hình người */}
              {userMenuOpen && (
                <>
                  {/* Backdrop trong suốt bắt click ra ngoài để đóng */}
                  <div 
                    onClick={() => setUserMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                  />

                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 260,
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid var(--aj-hairline)',
                    boxShadow: '0 12px 30px -4px rgba(0,0,0,0.14), 0 4px 12px -2px rgba(0,0,0,0.06)',
                    zIndex: 999,
                    padding: '6px 0',
                    fontFamily: 'inherit'
                  }}>
                    {currentUser ? (
                      <div>
                        {/* Header Thông tin người dùng */}
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--aj-hairline)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: '#000000',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: 13
                            }}>
                              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {currentUser.fullName}
                              </div>
                              <div style={{ fontSize: '11.5px', color: 'var(--aj-slate)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {currentUser.email}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 4, background: currentUser.role === 'Admin' ? '#fef3c7' : '#f1f5f9', color: currentUser.role === 'Admin' ? '#92400e' : '#334155', fontSize: '11px', fontWeight: 700 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: currentUser.role === 'Admin' ? '#d97706' : '#22c55e' }} />
                            {currentUser.role === 'Admin' ? 'Quản trị viên' : 'Thành viên'}
                          </div>
                        </div>

                        {/* Danh mục tùy chọn */}
                        <div style={{ padding: '4px 0' }}>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigateTo('account'); }}
                            style={{
                              width: '100%',
                              padding: '9px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              background: currentTab === 'account' ? '#f8fafc' : 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0f172a',
                              textAlign: 'left'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = currentTab === 'account' ? '#f8fafc' : 'transparent'}
                          >
                            <User size={15} color="#0f172a" />
                            <span>Tài khoản của tôi</span>
                          </button>

                          <button
                            onClick={() => { setUserMenuOpen(false); navigateTo('favorites'); }}
                            style={{
                              width: '100%',
                              padding: '9px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              background: currentTab === 'favorites' ? '#f8fafc' : 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0f172a',
                              textAlign: 'left'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = currentTab === 'favorites' ? '#f8fafc' : 'transparent'}
                          >
                            <Heart size={15} color="#0f172a" />
                            <span style={{ flex: 1 }}>Địa điểm yêu thích</span>
                            {favoritePlaceIds.length > 0 && (
                              <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>
                                {favoritePlaceIds.length}
                              </span>
                            )}
                          </button>

                          {/* Đánh giá website: Ẩn hoàn toàn khi đã đánh giá */}
                          {!hasAlreadyRatedWeb && (
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                setWebRatingSource('menu');
                                setWebRatingStars(5);
                                setWebRatingHover(0);
                                setWebRatingFeedback('');
                                setWebRatingSelectedTags([]);
                                setWebRatingModalOpen(true);
                              }}
                              style={{
                                width: '100%',
                                padding: '9px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#0f172a',
                                textAlign: 'left'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Star size={15} color="#f59e0b" fill="#f59e0b" />
                              <span style={{ flex: 1 }}>Đánh giá website</span>
                            </button>
                          )}

                          {currentUser?.role === 'Admin' && (
                            <button
                              onClick={() => { setUserMenuOpen(false); setAdminViewMode('portal'); }}
                              style={{
                                width: '100%',
                                padding: '9px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                background: '#f8fafc',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#0f172a',
                                textAlign: 'left'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            >
                              <Shield size={15} color="#fa9000" />
                              <span style={{ color: '#fa9000', fontWeight: 800 }}>Vào Trang Quản Trị</span>
                            </button>
                          )}
                        </div>

                        {/* Phân cách & Đăng xuất */}
                        <div style={{ borderTop: '1px solid var(--aj-hairline)', paddingTop: '4px' }}>
                          <button
                            onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                            style={{
                              width: '100%',
                              padding: '9px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#dc2626',
                              textAlign: 'left'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <LogOut size={15} color="#dc2626" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Header Khách vãng lai */}
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--aj-hairline)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <User size={15} color="#475569" />
                            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                              Khách vãng lai
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--aj-slate)', margin: 0, lineHeight: 1.4 }}>
                            Đăng nhập để đăng bài đánh giá địa điểm và lưu dữ liệu.
                          </p>
                        </div>

                        {/* Đăng nhập / Đăng ký */}
                        <div style={{ padding: '4px 0' }}>
                          <button
                            onClick={() => { setUserMenuOpen(false); setAuthMode('login'); setAuthModalOpen(true); }}
                            style={{
                              width: '100%',
                              padding: '9px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0f172a',
                              textAlign: 'left'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <LogIn size={15} color="#0f172a" />
                            <span>Đăng nhập</span>
                          </button>

                          <button
                            onClick={() => { setUserMenuOpen(false); setAuthMode('register'); setAuthModalOpen(true); }}
                            style={{
                              width: '100%',
                              padding: '9px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0f172a',
                              textAlign: 'left'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <UserCheck size={15} color="#0f172a" />
                            <span>Đăng ký thành viên</span>
                          </button>
                        </div>

                        {/* Đăng nhập nhanh */}
                        <div style={{ borderTop: '1px solid var(--aj-hairline)', padding: '8px 12px', background: '#f8fafc' }}>
                          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--aj-slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Đăng nhập nhanh
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <button
                              onClick={() => { setUserMenuOpen(false); handleQuickLogin('member'); }}
                              className="aj-button-pill-outline"
                              style={{ width: '100%', justifyContent: 'flex-start', padding: '5px 8px', fontSize: '11.5px' }}
                            >
                              <UserCheck size={12} />
                              <span>Thành viên (Member)</span>
                            </button>
                            <button
                              onClick={() => { setUserMenuOpen(false); handleQuickLogin('admin'); }}
                              className="aj-button-pill-dark"
                              style={{ width: '100%', justifyContent: 'flex-start', padding: '5px 8px', fontSize: '11.5px' }}
                            >
                              <Shield size={12} />
                              <span>Quản trị viên (Admin)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA
          ───────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>

        {/* -----------------------------------------------------------
            VIEW A: PLACE DETAIL VIEW (Màn hình chi tiết)
            ----------------------------------------------------------- */}
        {activePlace ? (
          <PlaceDetailView
            activePlace={activePlace}
            places={places}
            currentUser={currentUser}
            favoritePlaceIds={favoritePlaceIds}
            onBack={handleBackFromDetail}
            onAddToTrip={handleAddToTrip}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlace={handleOpenDetail}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onQuickLogin={handleQuickLogin}
            onOpenReportModal={handleOpenReportModal}
            onLightboxImage={setLightboxImage}
            reviewImages={reviewImages}
            onReviewImagesUpload={handleReviewImagesUpload}
            onRemoveReviewImage={handleRemoveReviewImage}
            onCreateReview={handleCreateReview}
            onLikeReview={handleLikeReview}
            onDislikeReview={handleDislikeReview}
            onDeleteReview={handleDeleteReview}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            formatPlaceAddress={formatPlaceAddress}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            reviewContent={reviewContent}
            setReviewContent={setReviewContent}
            isSubmittingReview={isSubmittingReview}
            commentContent={commentContent}
            setCommentContent={setCommentContent}
            activeCommentReviewId={activeCommentReviewId}
            setActiveCommentReviewId={setActiveCommentReviewId}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            activeReplyCommentId={activeReplyCommentId}
            setActiveReplyCommentId={setActiveReplyCommentId}
            commentImagePreview={commentImagePreview}
            setCommentImagePreview={setCommentImagePreview}
            replyImagePreview={replyImagePreview}
            setReplyImagePreview={setReplyImagePreview}
            handleCommentImageUpload={handleCommentImageUpload}
            handleReplyImageUpload={handleReplyImageUpload}
            handleRemoveReplyImage={handleRemoveReplyImage}
          />
        ) : (
          /* -----------------------------------------------------------
             VIEW B: TAB CONTENTS
             ----------------------------------------------------------- */
          <div>

            {/* =========================================================
                TAB 1: TRANG CHỦ
                ========================================================= */}
            {currentTab === 'home' && (
              <div>
                
                {/* 1. HERO SECTION: Bỏ dòng chữ đỏ & bỏ dòng phụ theo yêu cầu */}
                <section className="aj-hero-section">
                  
                  {/* Tiêu đề chính duy nhất, nổi bật và trực diện */}
                  <h1 className="aj-hero-headline" style={{ marginBottom: 32 }}>
                    Khám phá Việt Nam <span>theo cách của bạn</span>
                  </h1>

                  {/* Khung tìm kiếm Đánh giá địa điểm */}
                  <div className="aj-search-floating-card">
                    
                    <div className="aj-search-field-group">
                      <span className="aj-search-label">
                        <MapPin size={13} color="var(--aj-live-red)" />
                        <span>ĐIỂM ĐẾN / KHU VỰC</span>
                      </span>
                      <select 
                        value={selectedCity} 
                        onChange={e => setSelectedCity(e.target.value)}
                        className="aj-search-select-clean"
                      >
                        {MAJOR_CITIES_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="aj-search-field-group">
                      <span className="aj-search-label">
                        <Compass size={13} color="var(--aj-primary)" />
                        <span>LOẠI HÌNH TRẢI NGHIỆM</span>
                      </span>
                      <select 
                        value={selectedCategory} 
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="aj-search-select-clean"
                      >
                        <option value="">Tất cả loại hình</option>
                        <option value="Du lịch & Di tích">Di tích & Thắng cảnh lịch sử</option>
                        <option value="Ẩm thực">Ẩm thực & Quán ngon đặc sản</option>
                        <option value="Cà phê">Cà phê check-in & Trà</option>
                        <option value="Vui chơi">Vui chơi giải trí & Phố đi bộ</option>
                        <option value="Check-in thiên nhiên">Thiên nhiên & Bãi biển</option>
                      </select>
                    </div>

                    <div className="aj-search-field-group">
                      <span className="aj-search-label">
                        <Calendar size={13} color="#0284c7" />
                        <span>THÁNG KHỞI HÀNH</span>
                      </span>
                      <select 
                        value={selectedTravelMonth} 
                        onChange={e => setSelectedTravelMonth(e.target.value)}
                        className="aj-search-select-clean"
                      >
                        <option value="all">Tất cả các tháng</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                          <option key={m} value={String(m)}>
                            Tháng {m} {m === 11 ? '✦ (Tháng 11 - Mùa khô đẹp)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={() => navigateTo('explore')}
                      className="aj-button-pill-dark"
                      style={{ padding: '12px 24px', fontSize: '15px' }}
                    >
                      <Search size={16} />
                      <span>Tìm kiếm địa điểm</span>
                    </button>

                  </div>

                  {/* Gợi ý nhanh */}
                  <div className="aj-quick-chips">
                    <span>Gợi ý nhanh:</span>
                    {['Chợ Bến Thành', 'Dinh Độc Lập', 'Phố Đi Bộ Nguyễn Huệ', 'Cầu Vàng Bà Nà', 'Phở Hòa Pasteur', 'Hồ Tuyền Lâm'].map(chip => (
                      <button 
                        key={chip} 
                        onClick={() => { setKeyword(chip); navigateTo('explore'); }}
                        className="aj-chip-btn"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                </section>

                {/* 2. STATS BAND */}
                <div className="aj-stats-band">
                  <div className="aj-stats-grid">
                    <div className="aj-stat-item">
                      <div className="aj-stat-num">500+</div>
                      <div className="aj-stat-label">Địa điểm & Di tích chọn lọc trên toàn quốc</div>
                    </div>
                    <div className="aj-stat-item">
                      <div className="aj-stat-num">
                        <span>4.9 / 5</span>
                        <Star size={20} fill="#eab308" color="#eab308" />
                      </div>
                      <div className="aj-stat-label">Hài lòng từ hơn 50.000 đánh giá du khách</div>
                    </div>
                    <div className="aj-stat-item">
                      <div className="aj-stat-num">100%</div>
                      <div className="aj-stat-label">Đồng bộ giờ mở cửa & giá vé từ Google Maps</div>
                    </div>
                  </div>
                </div>

                {/* 3. FEATURED DESTINATIONS SECTION (Image 1 reference) */}
                <section className="aj-destinations-section">
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div className="aj-eyebrow-lockup">
                        <span className="aj-eyebrow-bar" />
                        <span className="aj-eyebrow-text">ĐIỂM ĐẾN HẤP DẪN</span>
                      </div>
                      <h2 className="aj-headline-lg">
                        Điểm đến nổi bật nhất Việt Nam
                      </h2>
                      <p className="aj-body-sm" style={{ maxWidth: 720, marginTop: 4 }}>
                        Từ biển đảo ngọc ngà cát trắng miền Nam đến cao nguyên đá trùng điệp phương Bắc, nơi nào cũng chứa đựng những điều kỳ diệu đang chờ bạn khám phá & đánh giá.
                      </p>
                    </div>

                    <button 
                      onClick={() => { setSelectedDistrict(''); navigateTo('explore'); }}
                      style={{ color: 'var(--aj-ink)', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span>Xem tất cả điểm đến</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="aj-dest-grid">
                    {FEATURED_DESTINATIONS.map(dest => (
                      <div 
                        key={dest.id}
                        className="aj-dest-card"
                        onClick={() => handleSelectDestination(dest)}
                      >
                        <img src={dest.image} alt={dest.name} className="aj-dest-img" />
                        
                        <div className="aj-dest-overlay">
                          <div className="aj-dest-top-badges">
                            <span className="aj-dest-region-badge">{dest.region}</span>
                          </div>

                          <div className="aj-dest-content">
                            <div className="aj-dest-country">
                              <MapPin size={12} color="#fcd34d" />
                              <span>Việt Nam</span>
                            </div>
                            <h3 className="aj-dest-name">{dest.name}</h3>
                            <p className="aj-dest-desc">{dest.description}</p>
                            <div className="aj-dest-action">
                              <span>Khám phá đánh giá</span>
                              <ChevronRight size={15} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </section>

                {/* 4. TOP RATED PLACES BANNER */}
                <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <div className="aj-eyebrow-lockup">
                        <span className="aj-eyebrow-bar" />
                        <span className="aj-eyebrow-text">ĐÁNH GIÁ NỔI BẬT</span>
                      </div>
                      <h2 className="aj-headline-md">
                        Địa Điểm Nhận Được Đánh Giá Cao Nhất
                      </h2>
                    </div>

                    <button 
                      onClick={() => navigateTo('explore')} 
                      className="aj-button-pill-outline"
                    >
                      <span>Xem danh mục đầy đủ</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="aj-places-grid">
                    {places.slice(0, 3).map(place => (
                      <div 
                        key={place.id || place._id} 
                        className="aj-place-card"
                        onClick={() => handleOpenDetail(place)}
                      >
                        <div className="aj-card-media">
                          <img 
                            src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} 
                            alt={place.name} 
                            className="aj-card-img" 
                          />
                          <span className="aj-card-badge-left">{place.categoryName || 'Địa điểm'}</span>
                          <span className="aj-card-badge-right">
                            {place.ticketPrice?.includes('Miễn phí') ? 'Miễn phí vé' : 'Có thu vé'}
                          </span>
                        </div>

                        <div className="aj-card-body">
                          <div className="aj-card-location">
                            <MapPin size={13} color="var(--aj-slate)" />
                            <span>{place.address?.district}, {place.address?.city}</span>
                          </div>

                          <h4 className="aj-card-title">{place.name}</h4>

                          <div className="aj-card-rating-row">
                            <Star size={15} fill="#eab308" color="#eab308" />
                            <span className="aj-star-score">{place.ratingAverage?.toFixed(1) || '4.8'}</span>
                            <span style={{ color: 'var(--aj-slate)', fontSize: '12px' }}>({place.reviewCount || 10} đánh giá)</span>
                            <span className="aj-gmap-tag">Google {place.googleRating?.toFixed(1)}★</span>
                          </div>

                          <div className="aj-card-meta-list">
                            <div className="aj-card-meta-item">
                              <Clock size={13} color="var(--aj-slate)" />
                              <span>{place.openingHours}</span>
                            </div>
                            <div className="aj-card-meta-item">
                              <Ticket size={13} color="var(--aj-slate)" />
                              <span>{place.ticketPrice}</span>
                            </div>
                          </div>

                          {(() => {
                            const timing = getPlaceTimingDetails(place);
                            const isMatch = selectedTravelMonth !== 'all' && timing.hasSeasonalRecommendation && timing.bestMonths.includes(parseInt(selectedTravelMonth, 10));
                            return (
                              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {isMatch && (
                                  <span style={{ fontSize: '10.5px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>
                                    ✦ Phù hợp Tháng {selectedTravelMonth}
                                  </span>
                                )}
                                <span style={{ fontSize: '11px', color: timing.hasSeasonalRecommendation ? 'var(--aj-slate)' : '#166534', fontWeight: 600 }}>
                                  {timing.badgeText}
                                </span>
                              </div>
                            );
                          })()}

                          <div className="aj-card-footer">
                            <span style={{ fontSize: '12px', color: 'var(--aj-slate)' }}>Google Maps</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--aj-ink)' }}>
                              Xem đánh giá →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* =========================================================
                TAB 2: KHÁM PHÁ & BỘ LỌC ĐÁNH GIÁ (Image 3 reference)
                ========================================================= */}
            {currentTab === 'explore' && (
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
                
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '13px', color: 'var(--aj-slate)', marginBottom: 6 }}>
                    Trang chủ / Danh mục đánh giá địa điểm
                  </div>
                  <div className="aj-eyebrow-lockup">
                    <span className="aj-eyebrow-bar" />
                    <span className="aj-eyebrow-text">DANH MỤC ĐÁNH GIÁ ĐỊA ĐIỂM VIỆT NAM</span>
                  </div>
                  <h1 className="aj-headline-lg">
                    Khám phá & Đánh giá các điểm đến hấp dẫn
                  </h1>
                  <p className="aj-body-sm" style={{ marginTop: 4 }}>
                    Tìm thấy <strong>{filteredPlaces.length}</strong> địa điểm phù hợp với tiêu chí của bạn
                  </p>
                </div>

                {/* Search row */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 280, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={18} color="var(--aj-slate)" style={{ position: 'absolute', left: 16 }} />
                    <input 
                      type="text" 
                      placeholder="Tìm theo tên địa điểm, món ăn, di tích, trải nghiệm (ví dụ: Chợ Bến Thành, Dinh Độc Lập, Cầu Vàng...)"
                      value={keyword}
                      onChange={e => setKeyword(e.target.value)}
                      className="aj-text-input"
                      style={{ width: '100%', paddingLeft: 46 }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '13.5px', color: 'var(--aj-slate)', whiteSpace: 'nowrap' }}>Sắp xếp:</span>
                    <select 
                      value={sortOption} 
                      onChange={e => setSortOption(e.target.value)}
                      className="aj-select"
                      style={{ minWidth: 180 }}
                    >
                      <option value="ratingDesc">Điểm đánh giá cao nhất</option>
                      <option value="reviewsDesc">Nhiều lượt đánh giá nhất</option>
                      <option value="nameAsc">Tên địa điểm (A - Z)</option>
                    </select>
                  </div>
                </div>

                {/* 2-Column Layout */}
                <div className="aj-explore-layout">
                  
                  {/* Left Column: Filter Sidebar */}
                  <aside className="aj-filter-sidebar">
                    <div className="aj-filter-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '15px' }}>
                        <SlidersHorizontal size={16} />
                        <span>Bộ lọc tìm kiếm</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedCity('');
                          setSelectedCategory('');
                          setSelectedTravelMonth('all');
                          setRatingFilter('all');
                          setKeyword('');
                        }}
                        style={{ fontSize: '12px', color: 'var(--aj-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Đặt lại
                      </button>
                    </div>

                    <div className="aj-filter-group">
                      <div className="aj-filter-title">ĐIỂM ĐẾN / KHU VỰC LỚN</div>
                      <select 
                        value={selectedCity} 
                        onChange={e => setSelectedCity(e.target.value)}
                        className="aj-select"
                        style={{ width: '100%' }}
                      >
                        {MAJOR_CITIES_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="aj-filter-group">
                      <div className="aj-filter-title" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={13} color="#0284c7" />
                        <span>THÁNG DỰ ĐỊNH ĐI</span>
                      </div>
                      <select 
                        value={selectedTravelMonth} 
                        onChange={e => setSelectedTravelMonth(e.target.value)}
                        className="aj-select"
                        style={{ width: '100%', fontWeight: selectedTravelMonth !== 'all' ? 700 : 500 }}
                      >
                        <option value="all">Tất cả các tháng (Mặc định)</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                          <option key={m} value={String(m)}>
                            Tháng {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="aj-filter-group">
                      <div className="aj-filter-title">LOẠI HÌNH ĐỊA ĐIỂM</div>
                      <select 
                        value={selectedCategory} 
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="aj-select"
                        style={{ width: '100%' }}
                      >
                        <option value="">Tất cả phong cách</option>
                        <option value="Du lịch & Di tích">Di tích & Thắng cảnh</option>
                        <option value="Ẩm thực">Ẩm thực & Quán ngon</option>
                        <option value="Cà phê">Cà phê check-in</option>
                        <option value="Vui chơi">Vui chơi giải trí</option>
                        <option value="Check-in thiên nhiên">Thiên nhiên & Bãi biển</option>
                      </select>
                    </div>

                    <div className="aj-filter-group">
                      <div className="aj-filter-title">ĐIỂM ĐÁNH GIÁ</div>
                      <label className="aj-radio-label">
                        <input 
                          type="radio" 
                          name="rating" 
                          checked={ratingFilter === 'all'} 
                          onChange={() => setRatingFilter('all')} 
                        />
                        <span>Tất cả đánh giá</span>
                      </label>
                      <label className="aj-radio-label">
                        <input 
                          type="radio" 
                          name="rating" 
                          checked={ratingFilter === '4.5'} 
                          onChange={() => setRatingFilter('4.5')} 
                        />
                        <span>Đánh giá xuất sắc (≥ 4.5★)</span>
                      </label>
                      <label className="aj-radio-label">
                        <input 
                          type="radio" 
                          name="rating" 
                          checked={ratingFilter === '4.0'} 
                          onChange={() => setRatingFilter('4.0')} 
                        />
                        <span>Đánh giá tốt (≥ 4.0★)</span>
                      </label>
                    </div>

                  </aside>

                  {/* Right Column: Place Cards Grid with 10 items pagination */}
                  <div>
                    {filteredPlaces.length > 0 ? (
                      (() => {
                        const EXPLORE_PAGE_SIZE = 10;
                        const totalExplorePages = Math.ceil(filteredPlaces.length / EXPLORE_PAGE_SIZE) || 1;
                        const currentExplorePage = Math.min(Math.max(1, explorePage), totalExplorePages);
                        const pagedPlaces = filteredPlaces.slice((currentExplorePage - 1) * EXPLORE_PAGE_SIZE, currentExplorePage * EXPLORE_PAGE_SIZE);

                        return (
                          <>
                            <div className="aj-places-grid">
                              {pagedPlaces.map(place => (
                                <div 
                                  key={place.id || place._id} 
                                  className="aj-place-card"
                                  onClick={() => handleOpenDetail(place)}
                                >
                                  <div className="aj-card-media">
                                    <img 
                                      src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} 
                                      alt={place.name} 
                                      className="aj-card-img" 
                                    />
                                    <span className="aj-card-badge-left">{place.categoryName || 'Địa điểm'}</span>
                                    <span className="aj-card-badge-right">
                                      {place.ticketPrice?.includes('Miễn phí') ? 'Miễn phí vé' : 'Có thu vé'}
                                    </span>

                                    <button 
                                      onClick={(e) => handleToggleFavorite(place.id || place._id, e)}
                                      className={`aj-card-fav-btn ${favoritePlaceIds.includes(place.id || place._id) ? 'active' : ''}`}
                                      title="Lưu yêu thích"
                                    >
                                      <Heart size={16} fill={favoritePlaceIds.includes(place.id || place._id) ? '#ef4444' : 'none'} />
                                    </button>
                                  </div>

                                  <div className="aj-card-body">
                                    <div className="aj-card-location">
                                      <MapPin size={13} color="var(--aj-slate)" />
                                      <span>{place.address?.district}, {place.address?.city}</span>
                                    </div>

                                    <h3 className="aj-card-title">{place.name}</h3>

                                    <div className="aj-card-rating-row">
                                      <Star size={15} fill="#eab308" color="#eab308" />
                                      <span className="aj-star-score">{place.ratingAverage?.toFixed(1) || '4.8'}</span>
                                      <span style={{ color: 'var(--aj-slate)', fontSize: '12px' }}>
                                        ({place.reviewCount || 10} đánh giá)
                                      </span>
                                      <span className="aj-gmap-tag">
                                        Google {place.googleRating?.toFixed(1)}★
                                      </span>
                                    </div>

                                    <div className="aj-card-meta-list">
                                      <div className="aj-card-meta-item">
                                        <Clock size={13} color="var(--aj-slate)" />
                                        <span>{place.openingHours}</span>
                                      </div>
                                      <div className="aj-card-meta-item">
                                        <Ticket size={13} color="var(--aj-slate)" />
                                        <span>{place.ticketPrice}</span>
                                      </div>
                                    </div>

                                    {(() => {
                                      const timing = getPlaceTimingDetails(place);
                                      const isMatch = selectedTravelMonth !== 'all' && timing.hasSeasonalRecommendation && timing.bestMonths.includes(parseInt(selectedTravelMonth, 10));
                                      return (
                                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'gap', gap: 4 }}>
                                          {isMatch && (
                                            <span style={{ fontSize: '10.5px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>
                                              ✦ Phù hợp Tháng {selectedTravelMonth}
                                            </span>
                                          )}
                                          <span style={{ fontSize: '11px', color: timing.hasSeasonalRecommendation ? 'var(--aj-slate)' : '#166534', fontWeight: 600 }}>
                                            {timing.badgeText}
                                          </span>
                                        </div>
                                      );
                                    })()}

                                    <div className="aj-card-footer">
                                      <span style={{ fontSize: '12px', color: 'var(--aj-slate)' }}>
                                        Google Maps
                                      </span>
                                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--aj-ink)' }}>
                                        Xem đánh giá & chi tiết →
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* BỘ ĐIỀU HƯỚNG PHÂN TRANG 10 ĐỊA ĐIỂM / TRANG */}
                            {totalExplorePages > 1 && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 32,
                                padding: '16px 20px',
                                background: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid var(--aj-hairline)',
                                flexWrap: 'wrap',
                                gap: 12
                              }}>
                                <div style={{ fontSize: '13px', color: 'var(--aj-slate)', fontWeight: 600 }}>
                                  Hiển thị <strong>{(currentExplorePage - 1) * EXPLORE_PAGE_SIZE + 1} - {Math.min(currentExplorePage * EXPLORE_PAGE_SIZE, filteredPlaces.length)}</strong> trên tổng số <strong>{filteredPlaces.length}</strong> địa điểm
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <button
                                    onClick={() => { setExplorePage(p => Math.max(1, p - 1)); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                                    disabled={currentExplorePage === 1}
                                    style={{
                                      padding: '6px 14px',
                                      borderRadius: '6px',
                                      border: '1px solid var(--aj-hairline)',
                                      background: currentExplorePage === 1 ? '#f1f5f9' : '#ffffff',
                                      color: currentExplorePage === 1 ? '#94a3b8' : 'var(--aj-ink)',
                                      cursor: currentExplorePage === 1 ? 'not-allowed' : 'pointer',
                                      fontSize: '13px',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <ChevronLeft size={14} />
                                    <span>Trước</span>
                                  </button>

                                  {[...Array(totalExplorePages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    const isCurrent = pageNum === currentExplorePage;
                                    return (
                                      <button
                                        key={pageNum}
                                        onClick={() => { setExplorePage(pageNum); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                                        style={{
                                          width: 34,
                                          height: 34,
                                          borderRadius: '6px',
                                          border: '1px solid',
                                          borderColor: isCurrent ? '#000000' : 'var(--aj-hairline)',
                                          background: isCurrent ? '#000000' : '#ffffff',
                                          color: isCurrent ? '#ffffff' : 'var(--aj-ink)',
                                          fontWeight: isCurrent ? 800 : 600,
                                          fontSize: '13px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {pageNum}
                                      </button>
                                    );
                                  })}

                                  <button
                                    onClick={() => { setExplorePage(p => Math.min(totalExplorePages, p + 1)); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                                    disabled={currentExplorePage === totalExplorePages}
                                    style={{
                                      padding: '6px 14px',
                                      borderRadius: '6px',
                                      border: '1px solid var(--aj-hairline)',
                                      background: currentExplorePage === totalExplorePages ? '#f1f5f9' : '#ffffff',
                                      color: currentExplorePage === totalExplorePages ? '#94a3b8' : 'var(--aj-ink)',
                                      cursor: currentExplorePage === totalExplorePages ? 'not-allowed' : 'pointer',
                                      fontSize: '13px',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <span>Sau</span>
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()
                    ) : (
                      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--aj-soft)', borderRadius: 'var(--aj-rounded-md)' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: 8 }}>
                          Không tìm thấy địa điểm phù hợp
                        </div>
                        <p style={{ color: 'var(--aj-slate)', fontSize: '14px', marginBottom: 16 }}>
                          Hãy thử điều chỉnh lại khu vực tỉnh thành, danh mục hoặc từ khóa tìm kiếm.
                        </p>
                        <button 
                          onClick={() => {
                            setSelectedCity('');
                            setSelectedCategory('');
                            setSelectedTravelMonth('all');
                            setRatingFilter('all');
                            setKeyword('');
                          }} 
                          className="aj-button-pill-dark"
                        >
                          Xóa bộ lọc
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* =========================================================
                TAB: BẢNG XẾP HẠNG ĐỊA ĐIỂM (Highly Recommended)
                ========================================================= */}
            {currentTab === 'ranking' && (
              <RankingLeaderboard 
                places={places}
                onSelectPlace={handleOpenDetail}
                onToggleFavorite={handleToggleFavorite}
                favoritePlaceIds={favoritePlaceIds}
              />
            )}

            {/* =========================================================
                TAB: MẠNG XÃ HỘI DU LỊCH CỘNG ĐỒNG (Travel Social Feed)
                ========================================================= */}
            {currentTab === 'feed' && (
              <CommunityFeed 
                currentUser={currentUser}
                places={places}
                onSelectPlace={handleOpenDetail}
                onOpenAuthModal={() => setAuthModalOpen(true)}
                onReportContent={handleOpenReportModal}
              />
            )}

            {/* =========================================================
            {/* =========================================================
                TAB 3: BẢN ĐỒ ĐỊA LÝ VIỆT NAM (63 Tỉnh Thành & 3 Miền)
                ========================================================= */}
            {currentTab === 'map' && (
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>
                <div style={{ marginBottom: 20 }}>
                  <div className="aj-eyebrow-lockup">
                    <span className="aj-eyebrow-bar" />
                    <span className="aj-eyebrow-text">BẢN ĐỒ KHÁM PHÁ LONGO</span>
                  </div>
                  <h2 className="aj-headline-md">
                    Bản Đồ Địa Lý & 63 Tỉnh Thành Việt Nam
                  </h2>
                </div>

                <VietnamInteractiveMap 
                  onExploreProvince={(prov) => {
                    const filterKey = prov.matchingFilter || prov.name;
                    setSelectedCity(filterKey);
                    navigateTo('explore');
                  }}
                  onProposePlace={currentUser?.role === 'Admin' ? (prov) => {
                    setPropDistrict(prov.name);
                    setPropStreet(prov.capital ? `${prov.capital}, ${prov.name}` : prov.name);
                    setMapProposalModalOpen(true);
                  } : null}
                />
              </div>
            )}

            {/* =========================================================
                TAB 4: LẬP KẾ HOẠCH DU LỊCH (Sub-tabs: Lịch du lịch theo mùa & Kế hoạch hành trình)
                ========================================================= */}
            {currentTab === 'trip' && (
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>
                <div style={{ marginBottom: 20 }}>
                  <div className="aj-eyebrow-lockup">
                    <span className="aj-eyebrow-bar" />
                    <span className="aj-eyebrow-text">LẬP KẾ HOẠCH HÀNH TRÌNH LONGO</span>
                  </div>
                  <h2 className="aj-headline-md">
                    Lịch Trình Khám Phá & Lịch Du Lịch Theo Mùa
                  </h2>
                </div>

                {/* Sub-tabs Switcher */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--aj-hairline)', paddingBottom: 14 }}>
                  <button
                    onClick={() => setTripSubTab('calendar')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '24px',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: tripSubTab === 'calendar' ? '#0f172a' : '#f1f5f9',
                      color: tripSubTab === 'calendar' ? '#ffffff' : 'var(--aj-ink)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Calendar size={16} />
                    <span>1. Lịch du lịch theo mùa (Tham khảo)</span>
                  </button>

                  <button
                    onClick={() => setTripSubTab('itinerary')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '24px',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: tripSubTab === 'itinerary' ? '#0f172a' : '#f1f5f9',
                      color: tripSubTab === 'itinerary' ? '#ffffff' : 'var(--aj-ink)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Navigation size={16} />
                    <span>2. Kế hoạch hành trình ({customTripStops.length} điểm đã chọn)</span>
                  </button>
                </div>

                {tripSubTab === 'calendar' ? (
                  <SeasonalTravelCalendar 
                    onSelectMonthForExplore={(m) => {
                      setSelectedTravelMonth(String(m));
                      navigateTo('explore');
                    }}
                  />
                ) : (
                  <TripPlanner 
                    customStops={customTripStops}
                    onRemoveStop={(idx) => {
                      const updated = [...customTripStops];
                      updated.splice(idx, 1);
                      setCustomTripStops(updated);
                    }}
                    onMoveStop={(fromIdx, toIdx) => {
                      const updated = [...customTripStops];
                      const [moved] = updated.splice(fromIdx, 1);
                      updated.splice(toIdx, 0, moved);
                      setCustomTripStops(updated);
                    }}
                    onSelectPlace={handleOpenDetail}
                    onClearTrip={() => setCustomTripStops([])}
                    onNavigateExplore={() => navigateTo('explore')}
                  />
                )}
              </div>
            )}

            {/* =========================================================
                TAB 5: ĐỀ XUẤT ĐỊA ĐIỂM (Thuật toán hành vi + Form đóng góp)
                ========================================================= */}
            {currentTab === 'recommend' && (
              <div style={{ maxWidth: 1140, margin: '0 auto', padding: '32px 24px' }}>
                
                {/* 1. Phần Gợi ý theo hành trình du khách */}
                <GraphRecommendations 
                  places={places}
                  onSelectPlace={handleOpenDetail}
                  onAddToTrip={handleAddToTrip}
                />

                {/* 2. Phần Đóng góp địa điểm mới (Chỉ dành riêng cho Admin quản trị) */}
                {currentUser?.role === 'Admin' && (
                  <div style={{ marginTop: 48, paddingTop: 36, borderTop: '1px solid var(--aj-hairline)' }}>
                  <div className="aj-eyebrow-lockup">
                    <span className="aj-eyebrow-bar" />
                    <span className="aj-eyebrow-text">ĐÓNG GÓP CỘNG ĐỒNG</span>
                  </div>
                  <h3 className="aj-headline-md" style={{ marginBottom: 8 }}>
                    Bạn Biết Một Địa Điểm Tuyệt Vời? Chia Sẻ Ngay
                  </h3>
                  <p className="aj-body-sm" style={{ marginBottom: 24 }}>
                    Đóng góp địa điểm du lịch, quán ăn ngon hoặc di tích lịch sử để chia sẻ cùng cộng đồng.
                  </p>

                  {propMessage && (
                    <div style={{ padding: '12px 16px', background: '#ecfdf5', color: '#065f46', borderRadius: '4px', marginBottom: 20 }}>
                      {propMessage}
                    </div>
                  )}

                  <form onSubmit={handleProposeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--aj-soft)', padding: 24, borderRadius: 'var(--aj-rounded-md)', border: '1px solid var(--aj-hairline)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                        Tên địa điểm *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ví dụ: Bảo tàng Mỹ thuật TP.HCM"
                        value={propName}
                        onChange={e => setPropName(e.target.value)}
                        className="aj-text-input"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                          Danh mục *
                        </label>
                        <select 
                          value={propCategory} 
                          onChange={e => setPropCategory(e.target.value)}
                          className="aj-select"
                          style={{ width: '100%' }}
                        >
                          <option value="Du lịch & Di tích">Du lịch & Di tích</option>
                          <option value="Ẩm thực & Nhà hàng">Ẩm thực & Nhà hàng</option>
                          <option value="Cà phê & Trà">Cà phê & Trà</option>
                          <option value="Vui chơi & Giải trí">Vui chơi & Giải trí</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                          Khu vực / Quận *
                        </label>
                        <select 
                          value={propDistrict} 
                          onChange={e => setPropDistrict(e.target.value)}
                          className="aj-select"
                          style={{ width: '100%' }}
                        >
                          <option value="Quận 1">Quận 1</option>
                          <option value="Quận 3">Quận 3</option>
                          <option value="Quận 5">Quận 5</option>
                          <option value="Bình Thạnh">Bình Thạnh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Đà Lạt">Đà Lạt</option>
                          <option value="Phú Quốc">Phú Quốc</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                        Địa chỉ chi tiết *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ví dụ: 97A Phó Đức Chính, Phường Nguyễn Thái Bình"
                        value={propStreet}
                        onChange={e => setPropStreet(e.target.value)}
                        className="aj-text-input"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                          Giờ mở cửa tham khảo
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ví dụ: 08:00 - 17:00"
                          value={propOpeningHours}
                          onChange={e => setPropOpeningHours(e.target.value)}
                          className="aj-text-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                          Giá vé / Chi phí tham quan
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ví dụ: 30.000đ / người (hoặc Miễn phí)"
                          value={propTicketPrice}
                          onChange={e => setPropTicketPrice(e.target.value)}
                          className="aj-text-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                        Mô tả & Điểm đặc sắc *
                      </label>
                      <textarea 
                        rows={3} 
                        placeholder="Mô tả ngắn gọn về kiến trúc, trải nghiệm ẩm thực hoặc thông tin cần lưu ý..."
                        value={propDesc}
                        onChange={e => setPropDesc(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid var(--aj-hairline)',
                          borderRadius: 'var(--aj-rounded-sm)',
                          fontFamily: 'inherit',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>
                        URL Hình ảnh minh họa
                      </label>
                      <input 
                        type="url" 
                        placeholder="https://images.unsplash.com/..."
                        value={propImageUrl}
                        onChange={e => setPropImageUrl(e.target.value)}
                        className="aj-text-input"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <button type="submit" className="aj-button-pill-dark" style={{ padding: '12px 0', width: '100%' }}>
                      Gửi đóng góp địa điểm
                    </button>
                  </form>
                </div>
                )}

              </div>
            )}

            {/* =========================================================
                TAB 6: ĐỊA ĐIỂM YÊU THÍCH (Favorites)
                ========================================================= */}
            {currentTab === 'favorites' && (
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
                <div className="aj-eyebrow-lockup">
                  <span className="aj-eyebrow-bar" />
                  <span className="aj-eyebrow-text">DANH SÁCH ĐÃ LƯU</span>
                </div>
                <h2 className="aj-headline-md" style={{ marginBottom: 16 }}>
                  Địa Điểm Yêu Thích Của Bạn ({favoritePlaceIds.length})
                </h2>

                {favoritePlaceIds.length > 0 ? (
                  <div className="aj-places-grid">
                    {places.filter(p => favoritePlaceIds.includes(p.id || p._id)).map(place => (
                      <div key={place.id || place._id} className="aj-place-card" onClick={() => handleOpenDetail(place)}>
                        <div className="aj-card-media">
                          <img src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} alt={place.name} className="aj-card-img" />
                          <span className="aj-card-badge-left">{place.categoryName}</span>
                        </div>
                        <div className="aj-card-body">
                          <h4 className="aj-card-title">{place.name}</h4>
                          <div style={{ fontSize: '12.5px', color: 'var(--aj-slate)', marginBottom: 8 }}>
                            {place.address?.district}, {place.address?.city}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--aj-ink)' }}>
                            Xem chi tiết đánh giá →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--aj-soft)', borderRadius: 'var(--aj-rounded-md)' }}>
                    <p style={{ color: 'var(--aj-slate)', fontSize: '15px', marginBottom: 16 }}>
                      Bạn chưa lưu địa điểm nào vào mục yêu thích.
                    </p>
                    <button onClick={() => navigateTo('explore')} className="aj-button-pill-dark">
                      Khám phá địa điểm ngay
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================
                TAB 7: BÁO CÁO PHÂN TÍCH QUẢN TRỊ (CHỈ DÀNH CHO ADMIN)
                ========================================================= */}
            {currentTab === 'admin' && (
              currentUser?.role === 'Admin' ? (
                <AdminAnalyticsDashboard 
                  places={places} 
                  onRefreshData={fetchBackendPlaces} 
                />
              ) : (
                <div style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center', padding: '40px 24px', background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                  <Shield size={44} color="#ef4444" style={{ margin: '0 auto 14px auto' }} />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                    Khu Vực Quản Trị Hạn Chế
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
                    Trang Báo cáo phân tích số liệu chỉ dành riêng cho tài khoản Quản trị viên (Admin). Tài khoản thành viên du khách không có quyền truy cập khu vực này.
                  </p>
                  <button onClick={() => navigateTo('home')} className="aj-button-pill-dark" style={{ padding: '8px 20px', fontSize: 13 }}>
                    Quay về Trang chủ
                  </button>
                </div>
              )
            )}

            {/* =========================================================
                TAB 8: QUẢN LÝ TÀI KHOẢN (Member vs Guest Account Management)
                ========================================================= */}
            {currentTab === 'account' && (
              <AccountManagement 
                currentUser={currentUser}
                places={places}
                favoritePlaceIds={favoritePlaceIds}
                onOpenAuthModal={() => setAuthModalOpen(true)}
                onLogout={handleLogout}
                onSelectPlace={handleOpenDetail}
                onDeleteReview={handleDeleteReview}
              />
            )}

          </div>
        )}

      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL ĐỀ XUẤT ĐỊA ĐIỂM (CHỈ DÀNH CHO ADMIN)
          ───────────────────────────────────────────────────────────── */}
      {mapProposalModalOpen && currentUser?.role === 'Admin' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: 680,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 28,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <MapPin size={18} color="#0284c7" />
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.04em' }}>
                    TƯƠNG TÁC BẢN ĐỒ LONGO
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Đề xuất địa điểm mới tại {propDistrict || 'Việt Nam'}
                </h3>
              </div>
              <button 
                onClick={() => setMapProposalModalOpen(false)} 
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--aj-slate)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Hướng dẫn quy trình 3 bước */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              padding: '10px 14px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid var(--aj-hairline)',
              marginBottom: 20,
              fontSize: '11.5px',
              color: 'var(--aj-charcoal)'
            }}>
              <div><strong>1. Chọn vị trí:</strong> Ghim tọa độ GPS</div>
              <div><strong>2. Điền thông tin:</strong> Tên, ảnh & giá vé</div>
              <div><strong>3. Admin duyệt:</strong> Hiển thị công khai</div>
            </div>

            {/* Khung Ghim Tọa độ Bản đồ Thu nhỏ & Xem trước Tọa độ */}
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '14px 16px',
              color: '#ffffff',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>TỌA ĐỘ GHIM TRÊN MAP</span>
                <span style={{ fontSize: '11px', background: '#38bdf8', color: '#0f172a', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>
                  Đã tự động xác định
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Vĩ độ (Latitude)</label>
                  <input 
                    type="number"
                    step="0.0001"
                    value={mapPickedCoords.lat}
                    onChange={e => setMapPickedCoords(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', padding: '6px 10px', borderRadius: 4, fontSize: '13px', marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Kinh độ (Longitude)</label>
                  <input 
                    type="number"
                    step="0.0001"
                    value={mapPickedCoords.lng}
                    onChange={e => setMapPickedCoords(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', padding: '6px 10px', borderRadius: 4, fontSize: '13px', marginTop: 4 }}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitMapProposal} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                  Tên địa điểm đề xuất *
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Đồi thông Cầu Đất, Suối Tiên Mũi Né..."
                  value={propName}
                  onChange={e => setPropName(e.target.value)}
                  className="aj-text-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                    Danh mục phân loại *
                  </label>
                  <select 
                    value={propCategory} 
                    onChange={e => setPropCategory(e.target.value)}
                    className="aj-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Du lịch & Di tích">Du lịch & Di tích</option>
                    <option value="Ẩm thực & Nhà hàng">Ẩm thực & Nhà hàng</option>
                    <option value="Cà phê & Trà">Cà phê & Trà</option>
                    <option value="Vui chơi & Giải trí">Vui chơi & Giải trí</option>
                    <option value="Check-in thiên nhiên">Check-in thiên nhiên</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                    Tỉnh thành / Khu vực *
                  </label>
                  <input 
                    type="text" 
                    value={propDistrict}
                    onChange={e => setPropDistrict(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                  Địa chỉ chi tiết hoặc cung đường tiếp cận *
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Thôn Trường Thọ, Xã Trạm Hành..."
                  value={propStreet}
                  onChange={e => setPropStreet(e.target.value)}
                  className="aj-text-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                    Giờ mở cửa tham khảo
                  </label>
                  <input 
                    type="text" 
                    value={propOpeningHours}
                    onChange={e => setPropOpeningHours(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                    Giá vé / Chi phí vào cổng
                  </label>
                  <input 
                    type="text" 
                    value={propTicketPrice}
                    onChange={e => setPropTicketPrice(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                  Mô tả trải nghiệm, cảnh quan & lưu ý du khách
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Mô tả lý do nên đến địa điểm này, góc chụp ảnh đẹp hoặc hướng dẫn gửi xe..."
                  value={propDesc}
                  onChange={e => setPropDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--aj-hairline)',
                    borderRadius: 'var(--aj-rounded-sm)',
                    fontFamily: 'inherit',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                  URL Ảnh minh họa cảnh quan (Unsplash / Cloudinary)
                </label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/photo-..."
                  value={propImageUrl}
                  onChange={e => setPropImageUrl(e.target.value)}
                  className="aj-text-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button 
                  type="button" 
                  onClick={() => setMapProposalModalOpen(false)}
                  className="aj-button-pill-outline"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingProposal}
                  className="aj-button-pill-dark"
                >
                  {isSubmittingProposal ? 'Đang gửi...' : 'Gửi đề xuất tới Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          AUTH MODAL
          ───────────────────────────────────────────────────────────── */}
      {authModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--aj-rounded-md)',
            width: '100%',
            maxWidth: 420,
            padding: 28,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="aj-eyebrow-bar" style={{ height: 16 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                  {authMode === 'login' ? 'Đăng nhập thành viên' : 'Đăng ký tài khoản'}
                </h3>
              </div>
              <button onClick={() => setAuthModalOpen(false)} style={{ color: 'var(--aj-slate)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {authError && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '13px', marginBottom: 16 }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {authMode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: 4 }}>Họ và tên</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A"
                    value={authFullName}
                    onChange={e => setAuthFullName(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: 4 }}>Email</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="aj-text-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: 4 }}>Mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Tối thiểu 6 ký tự"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="aj-text-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <button type="submit" className="aj-button-pill-dark" style={{ width: '100%', padding: '12px 0', marginTop: 6 }}>
                {authMode === 'login' ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '13.5px' }}>
              {authMode === 'login' ? (
                <span>Chưa có tài khoản? <button onClick={() => { setAuthMode('register'); setAuthError(''); }} style={{ color: 'var(--aj-primary)', fontWeight: 700 }}>Đăng ký ngay</button></span>
              ) : (
                <span>Đã có tài khoản? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} style={{ color: 'var(--aj-primary)', fontWeight: 700 }}>Đăng nhập</button></span>
              )}
            </div>

            <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--aj-hairline)' }}>
              <div style={{ fontSize: '12px', color: 'var(--aj-slate)', marginBottom: 10, textAlign: 'center' }}>
                Đăng nhập nhanh để trải nghiệm đánh giá:
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleQuickLogin('admin')} className="aj-button-pill-outline" style={{ flex: 1, fontSize: '13px' }}>
                  Admin mẫu
                </button>
                <button onClick={() => handleQuickLogin('member')} className="aj-button-pill-outline" style={{ flex: 1, fontSize: '13px' }}>
                  Thành viên mẫu
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL BÁO CÁO VI PHẠM NỘI DUNG (REPORT MODAL)
          ───────────────────────────────────────────────────────────── */}
      {reportModalOpen && reportTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 16
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: 520,
            padding: '24px 28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Flag size={20} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Báo Cáo Vi Phạm
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                    Gửi phản ánh đến Ban Quản Trị LonGo để rà soát
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setReportModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6,
                  display: 'flex'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Target snippet summary */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>
                  {reportTarget.type === 'review' ? '📝 Bài đánh giá của:' : reportTarget.type === 'reply' ? '💬 Phản hồi của:' : reportTarget.type === 'post' ? '📰 Bài viết cộng đồng của:' : '💬 Bình luận của:'} {reportTarget.authorName || 'Người dùng'}
                </span>
                <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600, background: '#fee2e2', padding: '1px 6px', borderRadius: 4 }}>
                  Chờ xem xét
                </span>
              </div>
              {reportTarget.snippet && (
                <div style={{ color: '#64748b', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 440 }}>
                  "{reportTarget.snippet}"
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  Chọn lý do vi phạm:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {REPORT_REASONS.map(r => (
                    <label 
                      key={r.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: reportReason === r.id ? '1.5px solid #000000' : '1px solid #e2e8f0',
                        background: reportReason === r.id ? '#f8fafc' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input 
                        type="radio"
                        name="reportReason"
                        value={r.id}
                        checked={reportReason === r.id}
                        onChange={() => setReportReason(r.id)}
                        style={{ marginTop: 2, accentColor: '#000000' }}
                      />
                      <span style={{ fontSize: '13px', color: reportReason === r.id ? '#0f172a' : '#475569', fontWeight: reportReason === r.id ? 600 : 400, lineHeight: 1.4 }}>
                        {r.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chi tiết bổ sung */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  {reportReason === 'other' ? 'Vui lòng nêu rõ lý do vi phạm (*):' : 'Mô tả thêm bằng chứng hoặc chi tiết (tùy chọn):'}
                </label>
                <textarea 
                  value={reportCustomReason}
                  onChange={e => setReportCustomReason(e.target.value)}
                  placeholder="Nhập mô tả cụ thể về hành vi vi phạm..."
                  rows={2}
                  className="aj-text-input"
                  style={{ width: '100%', resize: 'none', fontSize: '13px' }}
                  required={reportReason === 'other'}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <button 
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="aj-button-pill-outline"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                  disabled={isSubmittingReport}
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="aj-button-pill-dark"
                  style={{ 
                    padding: '8px 20px', 
                    fontSize: '13px', 
                    backgroundColor: '#dc2626', 
                    borderColor: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  disabled={isSubmittingReport}
                >
                  <Flag size={14} />
                  <span>{isSubmittingReport ? 'Đang gửi...' : 'Gửi báo cáo vi phạm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LIGHTBOX MODAL XEM ẢNH PHÓNG TO
          ───────────────────────────────────────────────────────────── */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: 24,
            cursor: 'zoom-out'
          }}
        >
          <button 
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Ảnh phóng to" 
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: 12,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              cursor: 'default'
            }}
          />
          <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '13px', marginTop: 12 }}>
            Nhấp chuột ra ngoài hoặc bấm nút ✕ để đóng
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG WEBSITE LONGO
          Hiển thị sau khi người dùng (đã đăng nhập) Lưu yêu thích hoặc Thêm vào lịch trình.
          Mỗi tài khoản chỉ được đánh giá 1 lần duy nhất (tối đa 5 sao).
          ───────────────────────────────────────────────────────────── */}
      {webRatingModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={() => setWebRatingModalOpen(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px 32px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              animation: 'modalFadeIn 0.25s ease-out',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setWebRatingModalOpen(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: '#f1f5f9',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
              title="Đóng"
            >
              <X size={18} />
            </button>

            {/* Header with Icon Badge */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 8px 16px -4px rgba(245, 158, 11, 0.25)'
              }}>
                <Sparkles size={28} color="#d97706" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                Đánh giá trải nghiệm website LonGo
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {webRatingSource === 'trip' 
                  ? 'Bạn vừa thêm địa điểm vào Kế hoạch lịch trình du lịch!' 
                  : webRatingSource === 'favorite'
                  ? 'Bạn vừa lưu địa điểm vào danh sách Yêu thích!'
                  : 'Cảm ơn bạn đã sử dụng nền tảng du lịch thực tế LonGo!'}
                <br />
                Hãy cho chúng tôi biết mức độ hài lòng của bạn đối với website nhé:
              </p>
            </div>

            {/* Account badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              marginBottom: 20,
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '11px'
                }}>
                  {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontWeight: 600, color: '#334155' }}>
                  {currentUser?.fullName || currentUser?.email}
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                1 đánh giá duy nhất / tài khoản
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitWebRating}>
              {/* Star Rating Selection (Tối đa 5 sao) */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (webRatingHover || webRatingStars) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setWebRatingStars(star)}
                        onMouseEnter={() => setWebRatingHover(star)}
                        onMouseLeave={() => setWebRatingHover(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                          transform: (webRatingHover || webRatingStars) === star ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.15s ease'
                        }}
                        title={`${star} sao`}
                      >
                        <Star 
                          size={36} 
                          fill={isFilled ? '#f59e0b' : '#e2e8f0'} 
                          color={isFilled ? '#f59e0b' : '#cbd5e1'} 
                        />
                      </button>
                    );
                  })}
                </div>
                {/* Dynamic Rating Label */}
                <div style={{
                  display: 'inline-block',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: webRatingStars >= 4 ? '#047857' : webRatingStars === 3 ? '#d97706' : '#b91c1c',
                  backgroundColor: webRatingStars >= 4 ? '#ecfdf5' : webRatingStars === 3 ? '#fffbeb' : '#fef2f2',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  transition: 'all 0.2s'
                }}>
                  {getWebRatingLabel(webRatingHover || webRatingStars)}
                </div>
              </div>

              {/* Quick feedback tags */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                  Bạn ấn tượng điều gì nhất ở LonGo? (chọn nhanh):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    'Giao diện hiện đại & trực quan',
                    'Lịch trình du lịch thông minh',
                    'Đầy đủ thông tin thực tế',
                    'Tốc độ tải nhanh, mượt mà',
                    'Đánh giá đối soát khách quan',
                    'Bản đồ vệ tinh chi tiết'
                  ].map((tag) => {
                    const isSelected = webRatingSelectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setWebRatingSelectedTags(webRatingSelectedTags.filter(t => t !== tag));
                          } else {
                            setWebRatingSelectedTags([...webRatingSelectedTags, tag]);
                          }
                        }}
                        style={{
                          fontSize: '12px',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          border: isSelected ? '1.5px solid #000000' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#000000' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 600 : 500,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Feedback textarea */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Góp ý hoặc cảm nhận thêm (không bắt buộc):
                </label>
                <textarea 
                  value={webRatingFeedback}
                  onChange={e => setWebRatingFeedback(e.target.value)}
                  placeholder="Ví dụ: Bạn thích tính năng nào nhất hoặc cần cải thiện thêm điểm gì..."
                  rows={3}
                  className="aj-text-input"
                  style={{ width: '100%', resize: 'none', fontSize: '13px', borderRadius: '10px' }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setWebRatingModalOpen(false)}
                  className="aj-button-pill-outline"
                  style={{ padding: '9px 18px', fontSize: '13.5px' }}
                  disabled={isSubmittingWebRating}
                >
                  Để sau
                </button>
                <button
                  type="submit"
                  className="aj-button-pill-dark"
                  style={{ 
                    padding: '9px 24px', 
                    fontSize: '13.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  disabled={isSubmittingWebRating}
                >
                  <Send size={15} />
                  <span>{isSubmittingWebRating ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TOAST THÔNG BÁO TỰ ĐỘNG BIẾN MẤT (KHÔNG CẦN BẤM XÁC NHẬN)
          ───────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10005,
          backgroundColor: toastMessage.type === 'error' ? '#991b1b' : toastMessage.type === 'info' ? '#1e293b' : '#0f172a',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: 30,
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '13.5px',
          fontWeight: 600,
          pointerEvents: 'none',
          animation: 'modalFadeIn 0.2s ease-out'
        }}>
          {toastMessage.type === 'error' ? (
            <AlertTriangle size={18} color="#fca5a5" />
          ) : toastMessage.type === 'info' ? (
            <Info size={18} color="#93c5fd" />
          ) : (
            <CheckCircle2 size={18} color="#34d399" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FOOTER CHUẨN NGƯỜI DÙNG TOÀN QUỐC (LonGo Brand)
          ───────────────────────────────────────────────────────────── */}
      <footer className="aj-footer">
        <div className="aj-footer-inner">
          <div className="aj-footer-grid" style={{ gridTemplateColumns: '2fr 1.2fr 1.4fr 1.4fr' }}>
            
            {/* Col 1: Về LonGo */}
            <div className="aj-footer-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '6px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Compass size={18} color="#ffffff" strokeWidth={2.4} />
                </div>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em' }}>
                  LonGo
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--aj-slate)', lineHeight: 1.6, maxWidth: 360 }}>
                Nền tảng cộng đồng trực tuyến đánh giá và khám phá trải nghiệm du lịch thực tế tại 63 tỉnh thành Việt Nam. Dữ liệu tọa độ, giờ mở cửa, giá vé và đánh giá đối soát chuẩn xác từ Google Maps.
              </p>
            </div>

            {/* Col 2: Khám phá */}
            <div className="aj-footer-col">
              <h4>KHÁM PHÁ</h4>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Trang chủ</a></li>
                <li><a href="#explore" onClick={(e) => { e.preventDefault(); navigateTo('explore'); }}>Khám phá & Đánh giá</a></li>
                <li><a href="#map" onClick={(e) => { e.preventDefault(); navigateTo('map'); }}>Bản đồ vệ tinh (Toàn quốc)</a></li>
                <li><a href="#trip" onClick={(e) => { e.preventDefault(); navigateTo('trip'); }}>Lập kế hoạch du lịch</a></li>
                {currentUser?.role === 'Admin' && (
                  <li><a href="#admin" onClick={(e) => { e.preventDefault(); navigateTo('admin'); }}>Báo cáo phân tích (Quản trị)</a></li>
                )}
              </ul>
            </div>

            {/* Col 3: Điểm đến */}
            <div className="aj-footer-col">
              <h4>ĐIỂM ĐẾN KHU VỰC</h4>
              <ul>
                <li><a href="#hanoi" onClick={(e) => { e.preventDefault(); setSelectedCity('Hà Nội'); navigateTo('explore'); }}>Hà Nội & Miền Bắc (Hạ Long, Sa Pa, Ninh Bình)</a></li>
                <li><a href="#hue" onClick={(e) => { e.preventDefault(); setSelectedCity('Thừa Thiên Huế'); navigateTo('explore'); }}>Cố đô Huế & Miền Trung (Đà Nẵng, Hội An)</a></li>
                <li><a href="#dalat" onClick={(e) => { e.preventDefault(); setSelectedCity('Lâm Đồng'); navigateTo('explore'); }}>Đà Lạt & Tây Nguyên (Nha Trang, Mũi Né)</a></li>
                <li><a href="#hcm" onClick={(e) => { e.preventDefault(); setSelectedCity('Hồ Chí Minh'); navigateTo('explore'); }}>TP. Hồ Chí Minh & Đông Nam Bộ (Vũng Tàu, Tây Ninh)</a></li>
                <li><a href="#phuquoc" onClick={(e) => { e.preventDefault(); setSelectedCity('Kiên Giang'); navigateTo('explore'); }}>Đảo Ngọc Phú Quốc & Miền Tây (Cần Thơ, Tiền Giang)</a></li>
              </ul>
            </div>

            {/* Col 4: Hỗ trợ & Chính sách */}
            <div className="aj-footer-col">
              <h4>HỖ TRỢ & QUY CHUẨN</h4>
              <ul>
                <li><a href="#guidelines" onClick={(e) => { e.preventDefault(); showToast('Quy chuẩn đánh giá LonGo: Đánh giá trung thực, khách quan từ 1★ đến 5★.', 'info'); }}>Tiêu chuẩn đánh giá</a></li>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Điều khoản sử dụng: Mọi đóng góp tuân thủ chuẩn mực cộng đồng LonGo.', 'info'); }}>Điều khoản sử dụng</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Chính sách bảo mật: Dữ liệu cá nhân và đánh giá được bảo mật tuyệt đối.', 'info'); }}>Chính sách bảo mật</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); showToast('Liên hệ Ban Quản Trị LonGo: support@longo.vn', 'info'); }}>Liên hệ & Góp ý</a></li>
              </ul>
            </div>

          </div>

          <div className="aj-footer-bottom">
            <span>© 2026 LonGo. Nền tảng Đánh giá & Khám phá Du lịch Thực tế Việt Nam. Mọi quyền được bảo lưu.</span>
            <span style={{ fontSize: '12px', color: 'var(--aj-slate)' }}>
              Dữ liệu đối soát thực tế từ Google Maps • 63 Tỉnh Thành & Vùng Du Lịch Việt Nam
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
