import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";

// OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userGooglePhotosData, setUserGooglePhotosData] = useState(null);
  const [instaToken, setInstaToken] = useState("");

  const googleSignInAndPhotosImport = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId:
        "1003042370541-6n0revjkml51l9pv7v74ga0qt4tof222.apps.googleusercontent.com",
      scopes: ["https://www.googleapis.com/auth/photoslibrary.readonly"],
    });

    useEffect(() => {
      if (response?.type === "success") {
        console.log(response?.authentication);
        setAccessToken(response.authentication.accessToken);
      }
    }, [response]);

    async function getUserData() {
      let userInfo = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      userInfo.json().then((data) => {
        console.log(data);
        setUserData(data);
      });
    }

    // async function fetchUserGooglePhotos() {
    //   let userPhotos = await fetch(
    //     "https://photoslibrary.googleapis.com/v1/mediaItems",
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         "Content-type": "application/json",
    //       },
    //     }
    //   );
    //   userPhotos.json().then((data) => {
    //     console.log(data);
    //     setUserGooglePhotosData(data);
    //   });
    // }

    return (
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 17,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Google Authentication
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Button
            disabled={!request}
            title="Login"
            onPress={() => {
              promptAsync();
            }}
          />
          <Button
            title="User Data"
            onPress={() => {
              getUserData();
            }}
          />
          {/* <Button
            title="User Photos"
            onPress={() => {
              fetchUserGooglePhotos();
            }}
          /> */}
        </View>
        <View>
          <Text>{userData?.email}</Text>
          <Image
            source={{ uri: userData?.picture }}
            style={{ width: 100, height: 100 }}
          />
        </View>
        <FlatList
          data={userGooglePhotosData?.mediaItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Image
                source={{ uri: item.baseUrl }}
                style={{ width: 100, height: 100 }}
              />
              <Text>Shot by {item.mediaMetadata.photo.cameraMake}</Text>
            </View>
          )}
        />
      </View>
    );
  };

  // const instagramSignInAndPhotosImport = () => {
  //   const useProxy = Platform.select({ web: false, default: true });
  //   const client_id = 595681461938656;
  //   const redirect_uri = "https://auth.expo.io/@adithkrish98/shareNRemember";
  //   const scope = "user_profile,user_media";
  //   const site =
  //     "https://api.instagram.com/oauth/authorize?client_id=" +
  //     client_id +
  //     "&redirect_uri=" +
  //     redirect_uri +
  //     "&scope=" +
  //     scope +
  //     "&response_type=code&state=1";

  //   const discovery = { authorizationEndpoint: site };

  //   const [request, response, promptAsync] = useAuthRequest(
  //     {
  //       redirectUri: makeRedirectUri({
  //         useProxy,
  //         native: redirect_uri,
  //       }),
  //       scopes: [scope],
  //       clientId: client_id,
  //     },
  //     discovery
  //   );

  //   useEffect(() => {
  //     if (response?.type === "success") {
  //       const { code } = response.params;
  //       setInstaToken(code);
  //     }
  //   }, [response]);

  //   function getTokenFromCode(){
  //     const response = axios.post(`https://api.instagram.com/oauth/access_token`)
  //   }

  //   return (
  //     <View>
  //       <TouchableOpacity
  //         onPress={() =>
  //           promptAsync({
  //             useProxy,
  //             windowFeatures: { width: 700, height: 600 },
  //           })
  //         }
  //       >
  //         <Text>Connect Your Instagram</Text>
  //       </TouchableOpacity>
  //       <Button title="Exchange code for token" onPress={() => }/>
  //     </View>
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Share & Remember App</Text> */}
      {googleSignInAndPhotosImport()}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    paddingTop: 50,
  },
});
