import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

const SEARCH_USER = gql`
  query SearchUser($search: String) {
    searchUser(search: $search) {
      _id
      name
      username
      email
      password
    }
  }
`;

const FOLLOW_USER = gql`
    mutation AddFollow($followingId: ID) {
  addFollow(followingId: $followingId) {
    _id
    followingId
    followerId
    createdAt
    updatedAt
  }
}
`

const banner = {
    bannerPhoto: require('../../assets/bannerH8.jpeg'),
    userPhoto: require('../../assets/user1.jpeg'),
};

export default function SearchScreen({ navigation }) {
    const [search, onChangeSearch] = useState('');
    const { loading, error, data } = useQuery(SEARCH_USER, {
        variables: { search: search }
    });

    const [userFollow, {loadingFollow, errorFollow, dataFollow}] = useMutation(FOLLOW_USER)

    const handleFollow = (_id) => {
        userFollow({
            variables : {
                followingId: _id,
            },
            onCompleted: (data) => {
                ToastAndroid.show(
                    `Success Follow`,
                    ToastAndroid.SHORT
                );
            },
            onError: (error) => {
                console.error(error);

            }
        })
    }


    const renderUserData = () => {
        if (loading) {
            return <Text>Loading...</Text>;
        } else if (error) {
            return <Text>Error: {error.message}</Text>;
        } else if (data && data.searchUser && data.searchUser.length > 0) {
            return (
                <>
                    {data.searchUser.map(user => (
                        <View key={user._id} style={styles.card}>
                        <View style={styles.userInfoContainer}>
                          <Image source={banner.userPhoto} style={{ width: 40, height: 40, borderRadius: 20 }} />
                          <View style={styles.userInfoText}>
                            <Text>Email: {user.email}</Text>
                            <Text>Name: {user.name}</Text>
                            <Text>Username: {user.username}</Text>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => handleFollow(user._id)} style={styles.followButton}>
                          <Text style={{ color: 'white' }}>Follow</Text>
                        </TouchableOpacity>
                      </View>
                        
                    ))}
                </>
            );
        } else {
            return <Text style={{justifyContent: 'center', alignItems: 'center'}}>No user found</Text>;
        }
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.inputContainer}>
                        <View style={styles.rowContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="search user.."
                                value={search}
                                onChangeText={onChangeSearch}
                            />

                            <TouchableOpacity onPress={{}} style={styles.buttonSearch}>
                                <Text style={{ color: 'white' }}>Search</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView vertical showsVerticalScrollIndicator={false}>
                        {renderUserData()}
                    </ScrollView>
                    </View>

                   

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

    inputContainer: {
        marginTop: 50,
        marginLeft: 10,
        marginRight: 10,

    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        width: 270,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f1f1',
        padding: 10,
    },

    buttonSearch: {
        backgroundColor: 'black',
        borderRadius: 25,
        marginLeft: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10, 
        paddingVertical: 5, 
      },
      userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      userInfoText: {
        marginLeft: 10,
      },
      followButton: {
        backgroundColor: 'black',
        borderRadius: 8,
        padding: 5,
        height: 25,
        width: 50
      },
});
