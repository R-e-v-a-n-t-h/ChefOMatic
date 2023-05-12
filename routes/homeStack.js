import { createStackNavigator} from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../components/pages/home/Home"

import RobotVision from "../components/pages/robotVision/RobotVision"
import VisionResults from "../components/pages/robotVision/VisionResults";

import ScanForDishes from "../components/pages/scanForDishes/ScanForDishes"
import IngredientsPanel from "../components/pages/scanForDishes/IngredientsPanel"
import Dishes from "../components/pages/scanForDishes/Dishes"
import Recipe from "../components/pages/scanForDishes/Recipe"

import ScanForGPT from "../components/pages/usingGPT/ScanForGPT"
import IngredientsGPT from "../components/pages/usingGPT/IngredientsGPT"
import GPTRecipe from "../components/pages/usingGPT/GPTRecipe"

import Header from "../components/Header"


const screens ={
    
    Home:{
        screen: Home,
        navigationOptions: {
            headerTitle:() => <Header title= "ChefOMatic"/> }
    },
    
    
    RobotVision: {
        screen: RobotVision,
        navigationOptions: {
            headerTitle:() => <Header title= "Robot Vision Test"/> }
    },
    VisionResults:{
        screen:VisionResults,
        navigationOptions: {
            headerTitle:() => <Header title= "Vision Results"/> }
    },
    
    
    ScanForDishes:{
        screen: ScanForDishes,
        navigationOptions: {
            headerTitle:() => <Header title= "Robot Vision"/> }
    },
    IngredientsPanel:{
        screen:IngredientsPanel,
        navigationOptions: {
            headerTitle:() => <Header title= "Ingredients Panel"/> }
    },
    Dishes:{
        screen:Dishes,
        navigationOptions: {
            headerTitle:() => <Header title= "Dishes"/> }
    },
    
    Recipe:{
        screen:Recipe,
        navigationOptions: {
            headerTitle:() => <Header title= "Recipe"/> }
    },


    ScanForGPT:{
        screen: ScanForGPT,
        navigationOptions: {
            headerTitle:() => <Header title= "Robot Vision"/> }
    },
    IngredientsGPT:{
        screen:IngredientsGPT,
        navigationOptions: {
            headerTitle:() => <Header title= "Ingredients Panel"/> }
    },
    GPTRecipe:{
        screen: GPTRecipe,
        navigationOptions: {
            headerTitle:() => <Header title= "Recipe From ChatGPT"/> }
    }



}

const HomeStack = createStackNavigator(screens)
export default createAppContainer(HomeStack)