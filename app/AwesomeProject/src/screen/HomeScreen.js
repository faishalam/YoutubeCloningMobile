import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useQuery, gql } from '@apollo/client';
import timeSince from "../helpers/date";
import { useFocusEffect } from "@react-navigation/native";

const GET_POST = gql`
 query PostIncludeUser {
  postIncludeUser {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    user {
      _id
      name
      username
      email
      password
    }
  }
}
`

const GET_USER = gql`
query WhoAmI {
  whoAmI {
    name
  }
}
`

export default function HomeScreen({ navigation }) {
    const { loading, error, data, refetch } = useQuery(GET_POST)

    console.log(data)

    const handleRefresh = async () => {
        await refetch()
    }
    

    if (loading) {
        return <>
            <ActivityIndicator />
        </>
    }

    if (error) {
        return <>
            <Text>Error occured</Text>
        </>
    }

    
    const handleCardClick = (item) => {
        navigation.navigate('DetailScreen', { postId: item._id })
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleCardClick(item)}>
            
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.imgUrl }} style={styles.thumbnail} />

                <View style={styles.infoContainer}>
                    <Image source={{ uri: item.imgUrl }} style={styles.userPhoto} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.content}</Text>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.detailsText}>{item.user[0].username} · </Text>
                            <Text style={styles.detailsText}>{item.comments.length} comments · </Text>
                            <Text style={styles.detailsText}>{item.likes.length} likes · </Text>
                            <Text style={styles.detailsText}>{timeSince(item.createdAt)} </Text>
                        </View>
                    </View>
                </View>
            </View>

        </TouchableOpacity>

    );

    return (
        <SafeAreaView style={styles.container}>
            {
                loading && <ActivityIndicator size="large"
                    color="black"
                />
            }
            {
                !loading && <FlatList
                    data={data?.postIncludeUser}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                />
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    itemContainer: {
        marginVertical: 10,
    },
    thumbnail: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: 'light',
    },
    detailsContainer: {
        flexDirection: 'row',
    },
    detailsText: {
        fontSize: 12,
        marginTop: 3,
        color: 'grey',
    },

    loading: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
})
