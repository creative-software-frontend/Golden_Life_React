// import Header from "@/pages/common/Footer/Header/Header"
import HeroSection from "../HeroSection/HeroSection"
import BannerSection from '@/pages/Home/BannerSection/BannerSection';
import Categories from "../Categories/Categories";
// import Cart from "../Cart/Cart";
// import LiveChat from "@/pages/Home/LiveChat/Livechat";
import ProductCategories from "../ProductCategories/ProductCategories";
import FreshSell from "../FreshSell/FreshSell";
import TrendingCategory from "@/pages/Home/TrendingCategory/TrendingCategory";
import AutoScrollIcons from "../ScrollCategories/ScrollCategories";
// import Cart2 from "../Cart/Cart2";
import CourseCategories from "../CoursesCategory/CoursesCategory";

const Home = () => {
  return (
    <div>
      <HeroSection />
      {/* <BannerSection /> */}
      <AutoScrollIcons />
      <CourseCategories />
      <Categories />
      <ProductCategories />
      <FreshSell /> 
      {/* {/* <TrendingCategory /> */}
    </div>
  )
}

export default Home