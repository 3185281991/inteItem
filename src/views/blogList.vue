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

    <el-table
      :data="filterTableData"
      stripe
      max-height="666"
      :default-sort="{ prop: 'bid', order: 'descending' }"
      style="width: 100%; margin: 0 auto"
      empty-text="暂无"
    >
      <el-table-column prop="bid" label="bid" width="130" sortable />
      <el-table-column prop="uid" label="uid" width="130" sortable />
      <el-table-column prop="username" label="用户名" width="130" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="label" label="标签" width="100" />
      <el-table-column prop="time" label="时间">
        <template #default="scope">{{
          changeSecondToTime(scope.row.time, 2)
        }}</template>
      </el-table-column>
      <el-table-column prop="hot" label="热度" width="80" sortable />
      <el-table-column prop="lauds" label="评论数" width="100" sortable />
      <el-table-column prop="view" label="浏览数" width="100" sortable />
      <el-table-column prop="comment" label="回复数" width="110" sortable />
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
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClick(scope.row)"
            >详情</el-button
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
import { getBlog, getTotal, getSearch, deleteBlog } from "@/api/home";
import { ref, computed, reactive } from "vue";
import { changeSecondToTime, debounce, throttle } from "@/utils/index.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
let router = useRouter();
let dataInfo = reactive({ default: [1], like: [] });

let like = ref("");
let isSearch = ref(false);
let data = reactive([
  {
    page: 1,
    blogList: [],
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
    let res = await getBlog(data[0].page - 1);
    data[0].blogList = res.data;
    let res1 = await getTotal(0);
    data[0].total = res1.data[0].total;
  } else {
    let res = await getSearch(like.value, data[1].page - 1);
    data[1].likeList = res.data;
    let res1 = await getTotal(1, like.value);
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
    rs = data[0].blogList;
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
      let res = await getBlog(cpage - 1);
      data[0].blogList = data[0].blogList.concat(res.data);
    }
    dataInfo.default.push(cpage);
  } else {
    data[1].page = cpage;
    if (!dataInfo.like.includes(cpage)) {
      let res = await getSearch(like.value, cpage - 1);
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
let handleClick = (row) => {
  router.push(`/text/${row.bid}`);
};
let deleteClick = (row) => {
  ElMessageBox.confirm("确定删除该帖子吗?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(async () => {
    let res = await deleteBlog(row.bid, row.img);
    if (res.data.flag == 1) {
      if (!isSearch.value) {
        let index = data[0].blogList.findIndex((item) => item.bid == row.bid);
        data[0].blogList.splice(index, 1);
        data[0].total--;
      } else {
        let index = data[1].likeList.findIndex((item) => item.bid == row.bid);
        data[1].likeList.splice(index, 1);
        data[1].total--;
      }
      ElMessage({
        type: "success",
        message: res.data.message,
      });
    } else {
      ElMessage({
        type: "warning",
        message: res.data.message,
      });
    }
  });
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
