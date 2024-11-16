// import Header from "@/pages/common/Footer/Header/Header"
import HeroSection from "../HeroSection/HeroSection"
import  BannerSection from '@/pages/Home/BannerSection/BannerSection';
import Categories from "../Categories/Categories";
import Cart from "../Cart/Cart";
import LiveChat from "@/pages/LiveChat/Livechat";
import ProductCategories from "../ProductCategories/ProductCategories";
import FreshSell from "../FreshSell/FreshSell";
import TrendingCategory from "@/pages/TrendingCategory/TrendingCategory";
import AutoScrollIcons from "../ScrollCategories/ScrollCategories";
import Cart2 from "../Cart/Cart2";

const Home = () => {
  return (
    <div>
         
          <HeroSection />
          <BannerSection />
          <AutoScrollIcons />
          <Categories />
          {/* <Cart /> */}
          {/* <Cart2/> */}
          {/* <LiveChat /> */}
          <ProductCategories />
          <FreshSell />
          <TrendingCategory />
    </div>
  )
}

export default Home