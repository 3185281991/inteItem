<template>
  <div class="">
    <div class="search">
      <el-input
        v-model="like"
        placeholder="请输入需要搜索信息"
        @keypress.enter="searchLike"
        @input="judgeSpace"
        @clear="clearLike"
        :suffix-icon="Search"
        clearable
      />
      <el-button type="primary" @click="searchLike">确定</el-button>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="用户信息修改"
      width="35%"
      @close="resetForm(ruleFormRef)"
    >
      <el-form
        ref="ruleFormRef"
        :model="changeuser"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="uid" prop="uid">
          <el-input
            v-model="changeuser.uid"
            type="text"
            autocomplete="off"
            readonly
          />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="changeuser.username"
            type="text"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input
            v-model="changeuser.pwd"
            type="text"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.number="changeuser.email" type="email" clearable />
        </el-form-item>
        <el-form-item label="自我介绍" prop="introduce">
          <el-input v-model.number="changeuser.introduce" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updateUser(ruleFormRef)"
            >Submit</el-button
          >
          <el-button @click="resetForm(ruleFormRef)">Cancel</el-button>
        </span>
      </template>
    </el-dialog>
    <el-table
      :data="filterTableData"
      stripe
      max-height="666"
      :default-sort="{ prop: 'bid', order: 'descending' }"
      style="width: 100%; margin: 0 auto"
      empty-text="暂无"
    >
      <el-table-column prop="uid" label="uid" width="130" sortable />
      <el-table-column prop="username" label="用户名" width="140" />
      <el-table-column prop="email" label="电子邮箱" width="180" />
      <el-table-column prop="pwd" label="密码" width="140" />
      <el-table-column prop="time" label="时间" sortable>
        <template #default="scope">{{
          changeSecondToTime(scope.row.time, 2)
        }}</template>
      </el-table-column>
      <el-table-column prop="introduce" label="个人介绍" />
      <el-table-column prop="avatar" label="头像地址" />
      <el-table-column width="160">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
            :suffix-icon="Search"
          />
        </template>
        <template #default="scope">
          <el-button link type="primary" size="small" @click="chat(scope.row)"
            >聊天</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClick(scope.row)"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="deleteClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="10"
      :pager-count="11"
      @update:current-page="changePage"
      background
      layout="prev, pager, next, jumper"
      :total="!isSearch ? data[0].total : data[1].total"
    />
  </div>
</template>

<script setup>
import {
  getAlluser,
  getuserTotal,
  getUserSearch,
  deleteUser,
  backUpdateUser,
  addChatlog,
  getChatlog,
  createChat,
  updateShow,
  getChatList,
} from "@/api/home";
import { concatChatInfo } from "@/utils/index";
import { ref, computed, reactive, watchEffect, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { debounce, changeSecondToTime, throttle } from "@/utils/index.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";

let store = useStore();
let router = useRouter();
const { eventHub } = getCurrentInstance().proxy;
let myuid = computed(() => store.state.uid).value;
let myusername = computed(() => store.state.username).value;
let myavatar = computed(() => store.state.avatar).value;

let dataInfo = reactive({ default: [1], like: [] });

let dialogVisible = ref(false);
let changeuser = ref({});
let ischange = ref(false);
let index = ref(0);
watchEffect(() => {
  let username = changeuser.value.username;
  let pwd = changeuser.value.pwd;
  let email = changeuser.value.email;
  let introduce = changeuser.value.introduce;
  //手动修改之前这里的具体值会变更两次，只要index后面进行了更改>2那么就可以提交修改
  if (!ischange.value) {
    index.value++;
    if (index.value > 2) {
      ischange.value = true;
    }
    //修改完成又要返回值
  }
});
const ruleFormRef = ref();
const rules = reactive({
  username: [
    { required: true, message: "Please input  usernmae", trigger: "blur" },
    { min: 1, max: 15, message: "Length should be 1 to 15", trigger: "blur" },
  ],
  pwd: [
    {
      required: true,
      message: "Please input password",
      trigger: "blur",
    },
    { min: 6, max: 15, message: "Length should be 1 to 15", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      message: "Please input a new formatted email",
      trigger: "blur",
    },
  ],
  introduce: [
    {
      required: false,
      message: "Please input introduce",
      trigger: "blur",
    },
    { min: 0, max: 30, message: "Length should be 0 to 30", trigger: "blur" },
  ],
});
let like = ref("");
let isSearch = ref(false);
let data = reactive([
  {
    page: 1,
    userList: [],
    total: 0,
  },
  {
    page: 1,
    likeList: [],
    total: 0,
  },
]);

let start = async (type = 0) => {
  if (type == 0) {
    let res = await getAlluser(data[0].page - 1);
    data[0].userList = res.data;
    let res1 = await getuserTotal(0);
    data[0].total = res1.data[0].total;
  } else {
    let res = await getUserSearch(like.value, data[1].page - 1);
    data[1].likeList = res.data;
    let res1 = await getuserTotal(1, like.value);
    data[1].total = res1.data[0].total;
  }
};
start(0);
const search = ref("");
const filterTableData = computed(() => {
  let rs = null;
  let start = null;
  let end = null;
  if (!isSearch.value) {
    start = (data[0].page - 1) * 10;
    end = data[0].page * 10;
    rs = data[0].userList;
  } else {
    start = (data[1].page - 1) * 10;
    end = data[1].page * 10;
    rs = data[1].likeList;
  }
  return rs.slice(start, end).filter((data) => {
    return (
      !search.value ||
      data.bid.toString().includes(search.value.toLowerCase()) ||
      data.uid.toString().includes(search.value.toLowerCase()) ||
      data.username.toLowerCase().includes(search.value.toLowerCase()) ||
      data.label.toLowerCase().includes(search.value.toLowerCase()) ||
      data.title.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

let searchLike = debounce(async () => {
  if (like.value == "") {
    ElMessage({
      message: "搜索信息不能为空",
      type: "warning",
    });
  } else {
    isSearch.value = true;
    start(1);
  }
}, 1000);

let changePage = async (cpage) => {
  if (!isSearch.value) {
    data[0].page = cpage;
    if (!dataInfo.default.includes(cpage)) {
      let res = await getAlluser(cpage - 1);
      data[0].userList = data[0].userList.concat(res.data);
    }
    dataInfo.default.push(cpage);
  } else {
    data[1].page = cpage;
    if (!dataInfo.like.includes(cpage)) {
      let res = await getUserSearch(like.value, cpage - 1);
      data[1].likeList = data[1].likeList.concat(res.data);
    }
    dataInfo.like.push(cpage);
  }
};
let judgeSpace = throttle(() => {
  if (like.value == "") {
    isSearch.value = false;
  }
}, 500);
let clearLike = () => {
  isSearch.value = false;
};
let chat = async (row) => {
  if (myuid != row.uid) {
    //先查看是否存在在聊天记录，显示了,这里要同时增加两条聊天记录，分别为自身
    let res0 = await getChatlog(myuid, row.uid);
    if (res0.data.length == 0) {
      let res1 = await addChatlog(
        myuid,
        row.uid,
        row.username,
        row.avatar,
        1,
        Date.now()
      );
      let res2 = await addChatlog(
        row.uid,
        myuid,
        myusername,
        myavatar,
        1,
        Date.now()
      );
      if (res1.data.flag == 1 && res2.data.flag == 1) {
        //同时聊天对象信息添加到聊天对象中左侧，以vuex中，避免刷新页面
        eventHub.$emit("addLog", {
          ruid: row.uid,
          rname: row.username,
          ravatar: row.avatar,
          isShow: 1,
          uid: myuid,
        });
        store.commit("addLog", { uid: row.uid });
        try {
          await createChat(myuid, row.uid);
        } catch (err) {
          console.log(err);
        }
        router.push(`/messageList`);
      } else {
        ElMessage({
          type: "error",
          message: "服务器出错了",
        });
      }
    } else {
      //如果存在，需要事件发送当前这个用户的uid,并且显示修改状态，同时要再次获取我和这个用户的聊天信息
      if (res0.data[0].isshow == 0) {
        await updateShow(myuid, row.uid, 1);
        let rs = {};
        let res = await getChatList(myuid, row.uid);
        if (res.data.length != 0) {
          rs[row.uid] = concatChatInfo(res.data[0].info);
        } else {
          let res2 = await getChatList(row.uid, myuid);
          if (res2.data[0]) {
            rs[row.uid] = concatChatInfo(res2.data[0].info);
          }
        }
        store.commit("addChat", rs);
      } else {
        store.commit("addLog", { uid: row.uid });
      }
      eventHub.$emit("addLog", {
        ruid: row.uid,
        rname: row.username,
        ravatar: row.avatar,
        isShow: 1,
        uid: myuid,
      });
      eventHub.$emit("jumpTochat", row.uid);
      router.push(`/messageList`);
    }
  }
};
let handleClick = (row) => {
  dialogVisible.value = true;
  changeuser.value = JSON.parse(JSON.stringify(row)); //进行深拷贝
};
let deleteClick = (row) => {
  ElMessageBox.confirm("确定删除该用户吗?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(async () => {
    let res = await deleteUser(row.uid, row.avatar);
    if (res.data.flag == 1) {
      if (!isSearch.value) {
        let index = data[0].userList.findIndex((item) => item.uid == row.uid);
        data[0].userList.splice(index, 1);
        data[0].total--;
      } else {
        let index = data[1].likeList.findIndex((item) => item.uid == row.uid);
        data[1].likeList.splice(index, 1);
        data[1].total--;
      }
      ElMessage({
        type: "success",
        message: res.data.message,
      });
    } else {
      ElMessage({
        type: "error",
        message: res.data.message,
      });
    }
  });
};

let updateUser = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      if (ischange.value) {
        let res = await backUpdateUser(
          changeuser.value.uid,
          changeuser.value.username,
          changeuser.value.pwd,
          changeuser.value.email,
          changeuser.value.introduce
        );
        if (res.data.flag == 1) {
          ElMessage({
            type: "success",
            message: res.data.message,
          });
          dialogVisible.value = false;
        } else {
          ElMessage({
            type: "error",
            message: res.data.message,
          });
        }
        ischange.value = false;
        index.value = 0;
      } else {
        ElMessage({
          type: "info",
          message: "请修改信息后再提交。",
        });
      }
    } else {
      ElMessage({
        type: "warning",
        message: "未满足条件",
      });
      return false;
    }
  });
};
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  index.value = 0;
};
</script>
<style scoped>
.search {
  margin: 10px 15px;
}
.search .el-input {
  width: 250px;
}
.search .el-button {
  margin-left: 15px;
}
img {
  max-width: 40px;
  height: 40px;
}

.el-pagination {
  margin-top: 20px;
  position: relative;
  width: 666px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}
</style>
