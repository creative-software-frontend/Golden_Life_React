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
 <div >
        <div className="mx-0 md:mx-8"> {/* Added bottom margin here */}

        <HeroSection />

    </div>
    {/* <BannerSection /> */}
   <div className="mx-0 md:mx-4 lg:mx-8">
        <AutoScrollIcons />
    </div>

    <div className="mx-0 md:mx-4 lg:mx-8">
        <CourseCategories />
    </div>

    <div className="mx-0 md:mx-4 lg:mx-8">
        <Categories />
    </div>

    <div className="mx-0 md:mx-4 lg:mx-8">
        <ProductCategories />
    </div>

    <div className="mx-0 md:mx-4 lg:mx-8">
        <FreshSell /> 
    </div>
    {/* <TrendingCategory /> */}
</div>
  )
}

export default Home