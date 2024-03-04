import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const USER_REGISTER = gql`
    mutation AddUser($newUser: NewUser) {
    addUser(newUser: $newUser) {
        _id
        name
        username
        email
        password
    }
}
`

export default function RegisterScreen({ navigation }) {
    const [name, onChangeName] = useState('')
    const [username, onChangeUsername] = useState('')
    const [email, onChangeEmail] = useState('')
    const [password, onChangePassword] = useState('')
    const [addUser, { loading, error, data }] = useMutation(USER_REGISTER)


    const handleSubmit = () => {
        console.log(password)
        addUser({
            variables: {
                newUser: {
                    email,
                    name,
                    password,
                    username
                }
            },
            refetchQueries: [
                USER_REGISTER
            ],
            onCompleted: (data) => {
                ToastAndroid.show(
                    `Register Success`,
                    ToastAndroid.SHORT
                );
                onChangeName('')
                onChangeUsername('')
                onChangeEmail('')
                onChangePassword('')
                navigation.navigate('LoginScreen')
            },
            onError: (error) => {
                console.error(error);

            }
        })
    }
    // console.log(password)


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Image
                        source={{
                            uri:
                                'https://download.logo.wine/logo/YouTube/YouTube-Logo.wine.png',
                        }}
                        style={{ width: 250, height: 50 }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="name"
                        onChangeText={onChangeName}
                        value={name}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="username"
                        onChangeText={onChangeUsername}
                        value={username}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        onChangeText={onChangeEmail}
                        value={email}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        onChangeText={onChangePassword}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity style={styles.buttonRegister} onPress={handleSubmit}>
                    <Text style={{ color: 'white' }}>Register</Text>
                </TouchableOpacity>

                <View style={styles.buttonLogin}>
                    <Text style={{ color: 'black' }}>Already have an account ?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={{ color: 'blue' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#ffffff',
    },

    header: {
        alignItems: 'center',
        marginBottom: 70
    },

    title: {
        fontSize: 23,
        fontWeight: 'bold',
    },

    inputContainer: {
        marginBottom: 20,
    },

    input: {
        width: 250,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
        marginBottom: 5,
        marginTop: 5,
        padding: 20
    },

    image: {
        width: 10,
        height: 10
    },

    buttonRegister: {
        backgroundColor: '#ff0000',
        borderRadius: 25,
        width: 150,
        height: 43,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonLogin: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5
    }
});
