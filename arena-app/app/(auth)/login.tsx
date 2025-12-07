import { CC, CL } from "@/components/styles/common";
import { supabase } from "@/libs/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { login } from "@react-native-seoul/kakao-login";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const configureGoogleLogin = () => {
  GoogleSignin.configure({
    webClientId: '665740865863-pli37193goqp872jg127ofcmpemco7hc.apps.googleusercontent.com', 
    offlineAccess: true,
  });
};

export default function Login() {
  const handleKakaoLoginPress = async () => {
    console.log('🚀 카카오 로그인 시작');
    const token = await login();

    console.log('✅ 카카오 로그인 성공! Token:', token);
    if (!token.idToken) {
      console.error('❌ 카카오 로그인 실패: idToken이 없습니다.');
      throw new Error('카카오 로그인 실패: idToken이 없습니다.');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'kakao',
      token: token.idToken,
    });

    if (error) throw error;

    console.log('🎉 Supabase 세션 생성 완료:', data);
    return data;
  }

  const handleGoogleLoginPress = async () => {
    console.log('🚀 구글 로그인 시작');
    configureGoogleLogin();

    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();
    console.log('구글 로그인 성공:', userInfo);

    if (!userInfo.data?.idToken) {
      console.error('❌ 구글 로그인 실패: idToken이 없습니다.');
      throw new Error('구글 로그인 실패: idToken이 없습니다.');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: userInfo.data.idToken,
    });

    if (error) throw error;

    console.log('🎉 Supabase 세션 생성 완료:', data)
    return data;
  }

  return (
    <SafeAreaView style={[CL.flex1, CC.bgWhite]}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={handleKakaoLoginPress}>
          <View style={[styles.button, styles.kakaoBtn, { width: "60%" }]}>
            <Image
              source={require("@/assets/images/kakao-symbol.png")}
              style={{ height: 24, width: 24 }}
            />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={[styles.text, styles.kakaoText, { opacity: 0.8 }]}
              >
                카카오로 로그인
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGoogleLoginPress}>
          <View style={[styles.button, styles.googleBtn, { width: "60%" }]}>
            <Image
              source={require("@/assets/images/google-symbol.png")}
              style={{ height: 24, width: 24 }}
            />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={[styles.text, styles.googleText]}
              >
                구글로 로그인
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  icon: { marginRight: 10 },
  text: { fontSize: 13, fontWeight: 'bold' },

  // 카카오 스타일
  kakaoBtn: { backgroundColor: '#FEE500' },
  kakaoText: { color: '#000000', opacity: 0.8 }, // 카카오 텍스트는 검정

  // 구글 스타일
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#747775', // 구글은 테두리가 살짝 있거나 그림자가 있어야 예쁨
  },
  googleText: { color: '#1F1F1F' },
});