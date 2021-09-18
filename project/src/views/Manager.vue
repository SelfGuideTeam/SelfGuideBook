<template>
  <v-container fill-height>
    <v-col cols="12" align="center">
      <v-card width="1200" tile flat>
        <v-card-title class="display-1">관리자 페이지</v-card-title>
        <v-divider></v-divider>
        <v-card width="400" class="pa-6 ma-6">
          <v-card-title class="headline">관리자 설정</v-card-title>
          <v-btn block color="primary" @click="setDialog">관리자로 설정</v-btn>
          <br />
          <v-btn block color="error" @click="revokeDialog">관리자를 해제</v-btn>
        </v-card>
      </v-card>
    </v-col>
    <v-dialog v-model="set" max-width="500">
      <v-card>
        <v-card-title style="backgroundColor:skyblue">이 아이디를 관리자로 설정하시겠습니까?</v-card-title>
        <v-card-text class="mt-3 subtitle-1">설정하려면 비밀번호를 입력해주세요</v-card-text>
        <v-text-field v-model="setPassword" type="password" label="비밀번호 입력" class="px-6"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-4 mb-3" text @click="setManager">설정</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="revoke" max-width="500">
      <v-card>
        <v-card-title style="backgroundColor:skyblue">관리자의 권한을 취소하시겠습니까?</v-card-title>
        <v-card-text class="mt-3 subtitle-1">취소하려면 비밀번호와 취소할 아이디를 입력해주세요</v-card-text>
        <v-text-field v-model="revokeEmail" label="취소할 아이디 입력" class="px-6"></v-text-field>
        <v-text-field v-model="revokePassword" type="password" label="비밀번호 입력" class="px-6"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-4 mb-3" text @click="checkPassword">실행</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="text-center"></div>
  </v-container>
</template>

<script>
import sha512 from "crypto-js/sha512";
export default {
  data() {
    return {
      set: false,
      setPassword: "",
      password: "",
      revoke: false,
      revokePassword: "",
      revokeEmail: "",
      rPassword: "",
      success: false
    };
  },
  methods: {
    setDialog() {
      this.set = !this.set;
    },
    revokeDialog() {
      this.revoke = !this.revoke;
    },
    setManager() {
      this.$firebase
        .firestore()
        .collection("Manager")
        .doc("PassWord")
        .get()
        .then(doc => {
          this.password = doc.data().password;
        })
        .then(() => {
          if (this.password == sha512(this.setPassword).toString()) {
            this.setManager_2();
            this.setPassword = "";
            this.password = "";
            alert("이 아이디가 관리자로 설정되었습니다");
            this.set = false;
          } else {
            alert("비밀번호가 틀렸습니다.");
            this.setPassword = "";
            this.password = "";
          }
        });
    },
    setManager_2() {
      this.$firebase
        .firestore()
        .collection("Manager")
        .doc("Managers")
        .collection("Managerss")
        .doc(localStorage.getItem("email"))
        .set({
          email: localStorage.getItem("email")
        });
    },
    checkPassword() {
      this.$firebase
        .firestore()
        .collection("Manager")
        .doc("RevokePassWord")
        .get()
        .then(doc => {
          this.password = doc.data().password;
        })
        .then(() => {
          if (this.password == sha512(this.revokePassword).toString()) {
            this.revokeManager();
            this.revoke = false;
            this.password = "";
            this.revokePassword = "";
          } else {
            alert("비밀번호가 틀렸습니다.");
            this.password = "";
            this.revokePassword = "";
            this.revokeEmail = "";
          }
        });
    },
    revokeManager() {
      this.$firebase
        .firestore()
        .collection("Manager")
        .doc("Managers")
        .collection("Managerss")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            alert(this.revokeEmail);
            if (doc.data().email == this.revokeEmail) {
              this.deleteManager();
              this.success = true;
            }
          });
        })
        .then(() => {
          if (this.success == false) {
            alert("아이디가 없습니다");
          }
        });
    },
    deleteManager() {
      this.$firebase
        .firestore()
        .collection("Manager")
        .doc("Managers")
        .collection("Managerss")
        .doc(this.revokeEmail)
        .delete()
        .then(() => {
          alert(this.revokeEmail + "님의 권한이 삭제되었습니다.");
          this.revokeEmail = "";
        });
    },
    Password() {
      this.$firebase
        .firestore()
        .collection("Manager")
        .doc("RevokePassWord")
        .set({
          password: sha512("5678").toString()
        });
    }
  }
};
</script>

<style></style>
