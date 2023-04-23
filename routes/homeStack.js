import { createStackNavigator} from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../components/pages/Home"
import Dishes from "../components/pages/Dishes"
import StartPage from "../components/pages/StartPage"
import ScanForDishes from "../components/pages/ScanForDishes"
import Recipe from "../components/pages/Recipe"
import AddOwnDish from "../components/pages/AddOwnDish"
import OwnDishes from "../components/pages/OwnDishes"
import RobotVision from "../components/pages/RobotVision"
import Header from "../components/Header"


const screens ={
    // StartPage:{
    //     screen: StartPage
    // },
    Home:{
        screen: Home,
        navigationOptions: {
            headerTitle:() => <Header title= "Home"/> }
    },
    Dishes:{
        screen:Dishes
    },
    ScanForDishes:{
        screen: ScanForDishes
    },
    RobotVision: {
        screen: RobotVision
    },
    Recipe:{
        screen:Recipe
    },
    AddOwnDish:{
        screen: AddOwnDish
    },
    OwnDishes:{
        screen: OwnDishes
    }

}

const HomeStack = createStackNavigator(screens)
export default createAppContainer(HomeStack)