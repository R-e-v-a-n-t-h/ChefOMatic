import { View, Text, TouchableOpacity, Image} from 'react-native'
import styles from './recipeCard.style'
import { icons } from '../../../constant'
const recipeCard = ({recipe, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.iconsContainer}>
        <Image
          source={{uri: icons.noImg}}
          resizeMode='contain'
          style={styles.icon} 
        />
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.recipeTitle} numberOfLines={1}>
        {recipe.job_title}
        </Text>
        <Text style={styles.recipeType}>{recipe.recipe_category_type}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default recipeCard