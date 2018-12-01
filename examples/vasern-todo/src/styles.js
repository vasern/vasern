import { StyleSheet } from 'react-native';
const colors = {
    line: 'rgba(0,0,0,0.15)',
    textLight: 'rgba(0,0,0,0.7)',
    primary: '#1e88e5',

    background: "#fff",
},
styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 20,
        paddingTop: 0
    },
    titleContainer: {
        margin: 20,
        marginBottom: 8
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    itemTextContainer: {
        flex: 1,
        paddingLeft: 16
    },
    item: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.9)'
    },
    itemCompleted: {
        color: colors.textLight,
        fontStyle: 'italic',
        fontSize: 16,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    itemContainer: {
        borderBottomColor: 'rgba(0,0,0,0.15)',
        borderBottomWidth: 0.5,
        marginTop: 20,
        paddingBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 30
    },
    itemContainer_Parent: {
        marginLeft: 0
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
    },
    bottomPanel: {
        padding: 10,
        backgroundColor: '#fffffff7',
        borderTopColor: 'rgba(0,0,0,0.15)',
        borderTopWidth: 0.5,
        display: 'flex',
        flexDirection: 'column'
    },
    textInput: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 15,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 25,
        flex: 1,
        marginRight: 10
    },
    textNegative: {
        color: 'red'
    },
    textBtn_lg: {
        color: colors.primary,
        fontSize: 16,
        padding: 8
    },
    textBtnWrapper: {
        backgroundColor: colors.primary,
        height: 32,
        width: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'

    },
    textBtn: {
        color: colors.background,
        fontWeight: "bold",
        fontSize: 20,
        paddingBottom: 3,
        paddingRight: 1
    },

    //
    incompleteIcon: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.line,
        margin: 5
    },
    completeIcon: {
        height: 22,
        width: 22,
        margin: 5,
        backgroundColor: colors.line,
        borderRadius: 11,
        opacity: 0.5
    },
    panelNote: {
        paddingBottom: 12,
        paddingLeft: 12,
        color: colors.textLight
    },
    note: {
        fontStyle: 'italic',
        opacity: 0.6
    }
});

export default styles;