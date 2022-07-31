<template>
  <div class="tcom" id="commo">
    <div class="tcbt">
      <div class="tcti">
        全部评论 {{ fcommentList.length + replyList.length }}
      </div>
      <div
        class="citem"
        v-show="true"
        v-for="item in fcommentList"
        :key="item.cuid"
      >
        <img :src="item.cavatar" alt="" />
        <div class="itr">
          <div class="ittip">
            <span>{{ item.cusername }}</span
            ><span>1月前</span>
          </div>
          <div class="fcon">
            <span>{{ item.ccontent }}</span>
          </div>
          <div class="rcom">
            <div
              class="reply"
              v-for="ritem in getConcreteReplys(
                replyList,
                item.cuid,
                item.time
              )"
              :key="ritem.time"
            >
              <img class="rimg" :src="ritem.ravatar" alt="" />
              <div class="ruser">
                <div class="ittip">
                  <span>{{ ritem.rusername }}</span
                  ><span>5月前</span>
                </div>
                <p>{{ ritem.rcontent }}</p>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commentView",
  props: {
    fcommentList: {
      type: Array,
      default: () => [],
    },
    replyList: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    let getConcreteReplys = (arr, cuid, time) => {
      let data = [];
      arr.forEach((item) => {
        return item.fuid == cuid && item.ftime == time ? data.push(item) : "";
      });
      return data;
    };

    return {
      getConcreteReplys,
    };
  },
};
</script>
<style scoped lang="scss">
.tcom {
  padding-bottom: 0.2083rem;
}
.tcti {
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  padding-left: 40px;
  font-weight: bold;
  margin-top: 10px;
}
.ittip {
  width: 100%;
  margin-top: -20px;
  display: flex;
  justify-content: space-between;
  span {
    font-size: 20px;
  }
  span:first-child {
    display: block;
    width: 0.7813rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span:last-child {
    margin-right: 0.1042rem;
  }
}
.tcbt {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;
  .citem {
    width: 100%;
    margin-top: 20px;
    display: flex;
    img {
      max-width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-left: 10px;
      margin-top: 10px;
      display: inline-block;
    }
    .itr {
      min-height: 80px;
      margin-left: 20px;
      padding-bottom: 40px;
      .ittip {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 16px;
        }
        span:first-child {
          display: block;
          width: 150px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span:last-child {
          margin-right: 20px;
        }
      }
      .fcon {
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 17px;
        }
      }
      .rcom {
        position: relative;
        top: 15px;
        width: 100%;

        .reply {
          width: 100%;
          margin: 0 auto;
          min-height: 80px;
          display: flex;
          background: rgba(247, 248, 250, 0.7);
          img {
            max-width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-top: 10px;
            margin-left: 10px;
          }
          .ruser {
            width: 100%;
            margin-top: 10px;
            margin-left: 10px;
            .ittip {
              margin-top: 0;
              width: 100%;
              span:first-child {
                font-size: 16px;
              }
            }
            p {
              width: 100%;
              margin-top: 8px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
