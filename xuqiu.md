在apiSlice里面帮我吧这个页面的增删改查搞搞吧。
增加：
/attr/add
入参数：这个form表单的数据，再加上这个criterionId；
返回值：
{
"code": 1,
"msg": "创建成功",
"time": "1750518633",
"data": {
"id": "6856cb691616b",
"createDate": "2025/06/21 18:49:35",
"lastModifiedDate": "2025/06/21 18:49:35",
"criterionId": "68568d46c7a9b542de9a44da",
"type": 0,
"seq": 5,
"name": "学习时间",
"options": [
"1小时",
"2小时",
"3小时"
],
"createUserId": "659befdda5f838b3673796b6",
"status": 0,
"fileUploadingStatus": 0,
"row": 1,
"inputType": 0,
"created_at": 1750518633,
"updated_at": 1750518633
}
}

更新接口
/attr/update
参数：criterionId 和上一步创建返回的 id其他的就获取form表单的数据即可

列表接口
/attr/lists
参数：criterionId
返回列表信息

删除接口
/attr/delete
参数：id
返回成功或者失败
