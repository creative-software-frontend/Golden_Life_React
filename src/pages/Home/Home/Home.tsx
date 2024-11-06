// import Header from "@/pages/common/Footer/Header/Header"
import HeroSection from "../HeroSection/HeroSection"
import  BannerSection from '@/pages/Home/BannerSection/BannerSection';
import Categories from "../Categories/Categories";
import Cart from "../Cart/Cart";
import LiveChat from "@/pages/LiveChat/Livechat";
import ProductCategories from "../ProductCategories/ProductCategories";
import FreshSell from "../FreshSell/FreshSell";

const Home = () => {
  return (
    <div>
         
          <HeroSection />
          <BannerSection />
          <Categories />
          <Cart />
          <LiveChat />
          <ProductCategories />
          <FreshSell />
    </div>
  )
}

export default Home