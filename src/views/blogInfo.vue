<template>
  <div class="bloginfo">
    <el-row>
      <el-col :span="10" :offset="1">
        <el-card>
          <div class="top"><span>今日发布</span></div>
          <div class="restrict">
            <ul
              class="today"
              v-if="today.length !== 0"
              :class="{ animate: today.length > 8 }"
            >
              <li
                v-for="item in today"
                :key="item.time"
                @click="$router.push(`/text/${item.bid}`)"
              >
                <span>{{ item.title }}</span
                ><span>{{ item.username }}</span
                ><span>{{ changeSecondToTime(item.time, 3) }}</span>
              </li>
            </ul>
            <p v-else>暂无新添加的帖子</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-card>
          <div class="ptop top">
            <span
              v-for="(item, index) in arr"
              :key="index"
              @click="changeIndex(index)"
              :class="{ active: index == activeIndex }"
              >{{ Object.keys(item)[0] }}</span
            >
          </div>
          <div class="restrict">
            <ul
              class="ph today"
              v-for="(itemx, index) in phList"
              :key="index"
              v-show="index == activeIndex"
              :class="{ panimate: itemx.length > 4 }"
            >
              <li
                v-for="item in itemx"
                :key="item.time"
                @click="$router.push(`/text/${item.bid}`)"
              >
                <span>{{ item.title }}</span
                ><span>{{ item.username }}</span
                ><span>{{ changeSecondToTime(item.time, 2) }}</span>
              </li>
              <li
                v-show="itemx.length > 4"
                v-for="item in itemx"
                :key="item.time"
                @click="$router.push(`/text/${item.bid}`)"
              >
                <span>{{ item.title }}</span
                ><span>{{ item.username }}</span
                ><span>{{ changeSecondToTime(item.time, 2) }}</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getPhByType, getToday } from "@/api/home";
import { changeSecondToTime } from "@/utils/index";
import { ref } from "vue";
let arr = [
  { 最高点赞: "lauds" },
  { 最多评论: "comment" },
  { 最多阅览: "view" },
  { 最高热度: "hot" },
];
let activeIndex = ref(0);
let today = ref([]);
let phList = ref([]);
let start = async () => {
  let res = await getToday();
  today.value = res.data;
  arr.forEach(async (item) => {
    let res1 = await getPhByType(item[Object.keys(item)[0]]);
    phList.value.push(res1.data);
  });
};
start();
let changeIndex = (index) => {
  activeIndex.value = index;
};
</script>
<style scoped>
.blogInfo {
  overflow: hidden;
}
.el-row {
  width: 100%;
  margin-top: 20px;
}
.concre li {
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.concre li span {
  font-size: 18px;
}
.top {
  width: 100%;
  height: 30px;
}
.top span {
  line-height: 30px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
}
.ptop {
  display: flex;
  justify-content: space-evenly;
}
.restrict {
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.restrict p {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}
.animate {
  animation: gl 10s infinite linear;
}
.animate:hover {
  animation-play-state: paused;
}
.panimate {
  animation: gl 15s infinite linear;
}
@keyframes gl {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
.today li {
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.today li:hover {
  cursor: pointer;
  background-color: #ccc;
}
.today li span {
  font-size: 16px;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.today li span:nth-child(1) {
  width: 120px;
}
.today li span:nth-child(2) {
  width: 100px;
}
.today li span:nth-child(3) {
  width: 80px;
}
.ph li span:nth-child(3) {
  width: 180px;
}
.active {
  border-bottom: 2px solid dodgerblue;
}
</style>
