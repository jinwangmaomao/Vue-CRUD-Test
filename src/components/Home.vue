<template>
  <div>
    <div style="width: 40%; text-align: left; display: inline-block">
      <el-input
        placeholder="请输入内容"
        v-model="searchName"
        clearable
        style="width:270px;">
      </el-input>
      <el-button circle icon="el-icon-search" @click="searchInformation"></el-button>
    </div>
    <div style="width: 50%; text-align: left; display: inline-block">
      <el-button type="primary" @click="dialog = true">添加</el-button>
      <el-drawer
        title="添加信息"
        :visible.sync="dialog"
        direction="ltr"
        custom-class="demo-drawer"
        ref="drawer">
        <div class="demo-drawer__content">
          <el-form :model="form">
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" :label-width="formLabelWidth">
              <div class="block">
                <el-date-picker
                  v-model="form.date"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button @click="cancelForm">取 消</el-button>
            <el-button type="primary" @click="insert">提交</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
    <el-table
      :data="tableData.records"
      style="width: 100%"
      :default-sort = "{prop: 'userDate'}">
      <el-table-column
        prop="userId"
        label="序号"
        width="140"
        type="index">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="userAddress"
        label="地址"
        width="500px">
      </el-table-column>
      <el-table-column
        prop="userDate"
        label="出生日期"
        sortable
        width="220">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="primary"
            plain
            @click="update(scope.row)">修改</el-button>
          <el-drawer
            title="修改信息"
            :visible.sync="modification"
            direction="ltr"
          >
            <div>
              <el-form :model="changeform">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                  <el-input v-model="changeform.userName"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                  <el-input v-model="changeform.userAddress"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" :label-width="formLabelWidth">
                  <div class="block">
                    <el-date-picker
                      v-model="changeform.userDate"
                      type="datetime"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </div>
                </el-form-item>
              </el-form>
              <div>
                <el-button @click="cancelForm">取 消</el-button>
                <el-button type="primary" @click="handleChange(changeform.userId)">提交</el-button>
              </div>
            </div>
          </el-drawer>
          <el-button
            size="medium"
            type="danger"
            plain
            @click="handleDelete(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-left: -80px; margin-top: 50px">
      <el-pagination
        :page-size="tableData.size"
        layout="prev, pager, next"
        :total="tableData.total" @current-change="pageIng">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Home",
      data() {
        return {
          /**
            数据库中的数据
          */
          tableData: [
          ],
          /**
            添加用户的数据集合
          */
          form: {
            name: '',
            address: '',
            date: '',
          },
          /**
            修改用户的数据集合
           */
          changeform: {
            id: '',
            name: '',
            address: '',
            date: '',
          },
          /**
           * 搜索框中的值
           */
          searchName:'',
          /**
           * 当前页数为1
           */
          pagination: 1,
          direction: 'rtl',
          /**
           * 添加的抽屉隐藏
           */
          dialog: false,
          /**
           * 修改的抽屉隐藏
           */
          modification: false,
          formLabelWidth: '80px',
        }
      },
      created() {
        this.addObject();
      },
      methods: {
        /**
         * 进行删除操作
         * @author LYJ
         * @date 2020-9-14
         * @param
                userId : 需要删除的用户序号
         * @return null
         */
        handleDelete(userId) {
          this.$http.delete("http://47.104.249.85:8084/LYJ/user/delete?userId="+userId).then(result=>{
            console.log(result.data);
            //判断方法是否成功
            let code = result.data.code;
            if(code === 100){
              this.$message.success(result.data.information);
            } else {
              this.$message.error(result.data.information);
            }
            //再次运行查询全部的分页操作
            this.addObject();
          })
        },
        /**
         * 显示修改抽屉
         * @author LYJ
         * @date 2020-9-15
         * @param
                row : 获取修改的数据
         * @return null
         */
        update(row){
          //显示修改抽屉
          this.modification = true;
          //查看修改数据
          console.log(row);
          //将数据添加到changeform集合中
          this.changeform = row;

        },
        formatter(row, column) {
          return row.address;
        },/**
         * 进行分页操作
         * @author LYJ
         * @date 2020-9-15
         * @param
                number : 当前点击的页码
         * @return null
         */
        pageIng(number){
          console.log(number);
          //显示点击的页码
          this.pagination = number;
          //获取点击的页码
          this.$http.get("http://47.104.249.85:8084/LYJ/user/query",{
            params: {
              pagination:this.pagination,
              name: this.searchName,
            }
          }).then(result=>{
            this.tableData = result.data.information;
          })
        },
        /**
         * 页面加载数据库中的数据
         * @author LYJ
         * @date 2020-9-14
         * @param
                null
         * @return null
         */
        addObject(){
          this.$http.get("http://47.104.249.85:8084/LYJ/user/query").then(result=>{
            this.tableData = result.data.information;
            console.log(result.data.information)
          })
        },/**
         * 进行插入操作
         * @author LYJ
         * @date 2020-9-15
         * @param
                null
         * @return null
         */
        insert(){
          this.$http.post("http://47.104.249.85:8084/LYJ/user/insert", {
            userName: this.form.name,
            userDate: this.form.date,
            userAddress: this.form.address,
          }).then(result=>{
            this.dialog = false;
            this.modification = false;
            //获取当前操作的code值
            let code = result.data.code;
            //如果code值为100，则显示插入成功，否则显示插入失败
            if(code === 100){
              this.$message.success(result.data.information);
            } else {
              this.$message.error(result.data.information);
            }
            //清空添加抽屉中的所有数据
            this.form.name = "";
            this.form.address = "";
            this.form.date = "";
            this.addObject();
          })
        },
        /**
         * 修改选取的记录
         * @author LYJ
         * @date 2020-9-15
         * @param
                userId : 当前需要修改的记录的ID
         * @return null
         */
        handleChange(userId){
          this.$http.put("http://47.104.249.85:8084/LYJ/user/update", {
            userId:userId,
            userName: this.changeform.userName,
            userDate: this.changeform.userDate,
            userAddress: this.changeform.userAddress,
          }).then(result=>{
            console.log(result.data)
            this.modification = false;
            let code = result.data.code;
            //如果code值为100，则显示修改成功，否则显示修改失败
            if(code === 100){
              this.$message.success(result.data.information);
            } else {
              this.$message.error(result.data.information);
            }
            this.changeform.name = "";
            this.changeform.address = "";
            this.changeform.date = "";
            this.addObject();
          })
        },
        /**
         * 搜索需要查找的记录
         * @author LYJ
         * @date 2020-9-15
         * @param
                null
         * @return null
         */
        searchInformation(){
          this.pagination = 1;
          this.$http.get("http://47.104.249.85:8084/LYJ/user/query",{
            params: {
              pagination:this.pagination,
              name: this.searchName,
            }
          }).then(result=>{
            console.log(result.data);
            this.tableData = result.data.information;
          })
        },
        //抽屉中的取消按钮，退出添加的抽屉和修改的抽屉
        cancelForm() {
          this.dialog = false;
          this.modification = false;
        }
      }
    }
</script>

<style scoped>

</style>
