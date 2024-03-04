import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard, ToastAndroid } from 'react-native';

const ADD_POST = gql`
    mutation AddPost($newPost: NewPost) {
    addPost(newPost: $newPost) {
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
    }
}
`

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
`;
export default function AddPostScreen({navigation}) {
    const [content, onChangeContent] = useState('')
    const [imgUrl, onChangeImageUrl] = useState('')
    const [tags, onChangeTags] = useState('')
    const [addPost, { loading, error, data }] = useMutation(ADD_POST);
      


    const handlePost = () => {
        addPost({
            variables: {
                newPost: {
                    content,
                    imgUrl,
                    tags,
                }
            },
            refetchQueries: [
                GET_POST
            ],
            onCompleted: (data) => {
                ToastAndroid.show(
                    `POST SUCCESS`,
                    ToastAndroid.SHORT
                );
                onChangeContent('')
                onChangeImageUrl('')
                onChangeTags('')
                navigation.push('HomeScreen')
            },
            onError: (error) => {
                console.error(error);
                
            }
        })
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.inputContent}
                        placeholder="What's on your mind?"
                        multiline
                        onChangeText={onChangeContent}
                        value={content}
                        />

                    <TextInput
                        style={styles.inputImageUrl}
                        placeholder="Add image url"
                        onChangeText={onChangeImageUrl}
                        value={imgUrl}
                    />

                    <TextInput
                        style={styles.inputImageUrl}
                        placeholder="Enter tag"
                        onChangeText={onChangeTags}
                        value={tags}
                    />
                    <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                        <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputContent: {
        height: 100,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 15,
        padding: 8,
        marginBottom: 16,
    },
    inputImageUrl: {
        height: 50,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 15,
        padding: 8,
        marginBottom: 16,
    },
    postButton: {
        backgroundColor: 'black',
        borderRadius: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35
    },
    postButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
