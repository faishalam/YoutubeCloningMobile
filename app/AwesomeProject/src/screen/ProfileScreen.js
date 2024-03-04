import React, { useContext, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LoginContext } from "../context/LoginContext";

const banner = {
  bannerPhoto: require('../../assets/bannerH8.jpeg'),
  userPhoto: require('../../assets/user1.jpeg'),
};


const GET_USER_PROFILE = gql`
  query GetUserById {
    getUserById {
      _id
      name
      username
      email
      password
      following {
        _id
        name
        username
        email
        password
      }
      followers {
        _id
        name
        username
        email
        password
      }
    }
  }
`;

export default function ProfileScreen({ navigation }) {
  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE)
  
  
  useEffect(() => {
    refetch();
  }, []);

  

  return (
    <View style={styles.container}>
      <Image source={banner.bannerPhoto} style={styles.banner} />

      <View style={styles.profileContainer}>
        <Image source={banner.userPhoto} style={styles.userPhoto} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{data?.getUserById[0]?.name}</Text>
          <Text style={styles.username}>@{data?.getUserById[0]?.username}</Text>
          <View style={styles.followContainer}>
            <Text style={styles.followText}>
              Followers: {data?.getUserById[0]?.followers.length} ·{" "}
            </Text>
            <Text style={styles.followText}>
              Following: {data?.getUserById[0]?.following.length}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.username}>{data?.getUserById[0]?.email}</Text>
      <Text style={styles.infoText}>Masih ragu? Kami selalu ada untuk kamu!</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.buttonFollow}
      >
        <Text style={styles.textButtonFollow}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 13,
    color: 'grey',
    marginBottom: 3,
  },
  followContainer: {
    flexDirection: 'row',
  },
  followText: {
    fontSize: 13,
    color: 'grey',
  },
  infoText: {
    fontSize: 13,
    color: 'grey',
    marginBottom: 10,
  },
  buttonFollow: {
    backgroundColor: 'black',
    borderRadius: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  textButtonFollow: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  banner: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
});
