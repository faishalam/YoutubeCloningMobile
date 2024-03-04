import { gql, useMutation, useQuery } from "@apollo/client"
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import timeSince from "../helpers/date"
import { useState } from "react"
import Ionicons from 'react-native-vector-icons/AntDesign'



const GET_POST_BY_ID = gql`
query PostsById($postId: ID) {
    postsById(postId: $postId) {
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

const POST_COMMENT = gql`
    mutation AddComments($postId: ID, $newComments: String) {
  addComments(postId: $postId, newComments: $newComments) {
    content
    username
    createdAt
    updatedAt
  }
}
`

const POST_LIKES = gql`
    mutation AddLikes($postId: ID) {
  addLikes(postId: $postId) {
    username
    createdAt
    updatedAt
  }
}
`

export default function DetailScreen({ route }) {
    const { loading, error, data } = useQuery(GET_POST_BY_ID, {
        variables: { postId: route.params.postId }
    })

    const [comment, onChangeComment] = useState('')
    const [addComment, { loadingComment, errorComment, dataComment }] = useMutation(POST_COMMENT)

    const[like, onChangeLike] = useState('')
    const [addLike, { loadingLike, errorLike, dataLoading }] = useMutation(POST_LIKES)

    const handlePostComment = () => {
        addComment({
            variables: {
                postId: route.params.postId,
                newComments: comment
            },
            refetchQueries: [
                GET_POST_BY_ID
            ],
            onCompleted: (data) => {
                onChangeComment('')
            },
            onError: (error) => {
                console.error(error);
            }
        })
    }

    const handleOnLike = () => {
        addLike({
            variables: {
                postId: route.params.postId,
            },
            refetchQueries: [
                GET_POST_BY_ID
            ],
            onCompleted: (data) => {
                onChangeLike('')
            },
            onError: (error) => {
                console.error(error);
            }
        })
    }

    const handleNotLike = () => {

    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Text>{comment}</Text>
                <Image source={{ uri: data?.postsById.imgUrl }} style={styles.thumbnail} />
                <View style={styles.header}>
                    <Text style={styles.textContent}>{data?.postsById.content}</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsText}>{data?.postsById.comments.length} comments · </Text>
                        <Text style={styles.detailsText}>{data?.postsById.likes.length} likes · </Text>
                        <Text style={styles.detailsText}>{timeSince(data?.postsById.createdAt)} · </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.likes} onPress={handleOnLike}>
                            <View style={styles.textIcon}>
                                <Ionicons name='like2' size={15} color='black' />
                                <Text style={{ color: 'black' }}>{data?.postsById.likes.length}</Text>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.likes}>
                            <View style={styles.textIcon}>
                                <Ionicons name="sharealt" size={15}></Ionicons>
                                <Text style={{ fontSize: 12 }}>Share</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.likes}>
                            <View style={styles.textIcon}>
                                <Ionicons name="save" size={15}></Ionicons>
                                <Text style={{ fontSize: 12 }}>Download</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.likes}>
                            <View style={styles.textIcon}>
                                <Ionicons name="download" size={15}></Ionicons>
                                <Text style={{ fontSize: 12 }}>Save</Text>
                            </View>
                        </TouchableOpacity>

                        
                    </ScrollView>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#f3f3f3', height: 20, marginTop: 10}}></View>


                    <View style={styles.colomnComments}>
                    <Text style={styles.titleComment}>{data?.postsById.comments.length} Comments</Text>
                        <ScrollView vertical showsVerticalScrollIndicator={false} style={styles.comments}>
                            
                            {data?.postsById.comments.length > 0 ? (
                                data?.postsById.comments.map((comment, index) => (
                                    <View key={index}>
                                        <Text style={styles.commentsUsername}>{comment.username}</Text>
                                        {comment.content !== null ? (
                                            <Text style={styles.commentsContent}>{comment.content}</Text>
                                        ) : (
                                            <Text style={{ fontSize: 12, marginLeft: 35, marginTop: 10, fontWeight: 'light' }}>Invalid comment content</Text>
                                        )}
                                        
                                    </View>
                                ))
                                
                            ) : (
                                <Text style={{ fontSize: 12, marginLeft: 35, marginTop: 10, fontWeight: 'light' }}>No comments available</Text>
                            )}
                        </ScrollView>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            style={styles.inputImageUrl}
                            placeholder="Express your comments..."
                            onChangeText={onChangeComment}
                            value={comment}
                        />

                        <TouchableOpacity style={styles.postButton} onPress={handlePostComment}>
                            <Text style={styles.postButtonText}>Comment</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView >
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        margin: 20
    },
    thumbnail: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginTop: 0
    },
    textContent: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detailsContainer: {
        flexDirection: 'row',
        marginTop: 5
    },
    detailsText: {
        fontSize: 12,
        marginTop: 3,
        color: 'grey',
    },
    comments: {
        backgroundColor: 'white',
        // padding: 10,
        borderRadius: 15,
        height: 270,
    },
    colomnComments: {
        marginTop: 10,    
    },
    titleComment: {
        marginTop: 15,
        marginLeft: 15,
        fontSize: 13,
        fontWeight: 'bold',
    },
    commentsUsername: {
        fontSize: 12,
        marginLeft: 35,
        marginTop: 10,
        fontWeight: 'bold',
    },
    commentsContent: {
        fontSize: 12,
        marginLeft: 35,
        marginBottom: 10,
    },
    modalContent: {
        flex: 0.5,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        margin: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    likes: {
        backgroundColor: '#f1f1f1',
        borderRadius: 25,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginRight: 10

    },
    textIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    commentInputContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        padding: 8,
    },
    commentSubmitButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        padding: 8,
    },
    commentSubmitButtonText: {
        color: 'white',
    },

    postButton: {
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 40,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 13
    },
})
