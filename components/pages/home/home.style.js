import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constant";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        
    },
    header:{
        width: '100%',
        height: 60,
        flexDirection:"row",
        alignItems: "center",
        justifyContent: 'space-between'
        
    },
    headerRightBtn: {
        alignSelf:"flex-end",
        alignItems: 'flex-end',
        justifyContent: 'center',
      },
      headerRightBtnIcon: {
        width: 20,
        height: 20,
      },

    headerText:{
        fontFamily: FONT.xtraBold,
        fontSize: SIZES.xLarge,
        color: COLORS.black,
        alignSelf:"flex-start"
    },
    title: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.white,
        //marginHorizontal: 10,
        //marginVertical: 10
      },
    searchContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: SIZES.large,
        height: 50,
      },
      searchWrapper: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginRight: SIZES.small,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium,
        height: "100%",
      },
      searchInput: {
        fontFamily: FONT.regular,
        width: "100%",
        height: "100%",
        paddingHorizontal: SIZES.medium,
      },
      searchBtn: {
        width: 50,
        height: "100%",
        backgroundColor: COLORS.tertiary,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
      },
      searchBtnImage: {
        width: "50%",
        height: "50%",
        tintColor: COLORS.white,
      },
});

export default styles;