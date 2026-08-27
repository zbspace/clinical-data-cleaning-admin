# lyq-admin管理端接口文档

**简介**:lyq-admin管理端接口文档

**HOST**:test.shucangyiyao.com

**联系人**:

**Version**:1.0

**接口路径**:/v2/api-docs

[TOC]

# cache-controller

## getVal

**接口地址**:`/lyqAdmin/api/admin/cache/getVal`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |
| key           | key          | query    | true     | string   |        |

**响应状态**:

| 状态码 | 说明         | schema         |
| ------ | ------------ | -------------- |
| 200    | OK           | Result«string» |
| 401    | Unauthorized |                |
| 403    | Forbidden    |                |
| 404    | Not Found    |                |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | string         |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": "",
	"msg": ""
}
```

## setVal

**接口地址**:`/lyqAdmin/api/admin/cache/setVal`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |
| key           | key          | query    | true     | string   |        |
| val           | val          | query    | false    | string   |        |

**响应状态**:

| 状态码 | 说明         | schema         |
| ------ | ------------ | -------------- |
| 200    | OK           | Result«string» |
| 201    | Created      |                |
| 401    | Unauthorized |                |
| 403    | Forbidden    |                |
| 404    | Not Found    |                |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | string         |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": "",
	"msg": ""
}
```

# 中心(医院)信息管理

## 获取关联登记号

**接口地址**:`/lyqAdmin/api/admin/hospital/getAcceptanceNos`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "hosOriginName": "",
  "hosStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0
}
```

**请求参数**:

| 参数名称                    | 参数说明                               | 请求类型 | 是否必须 | 数据类型           | schema             |
| --------------------------- | -------------------------------------- | -------- | -------- | ------------------ | ------------------ |
| Authorization               | 用户登录令牌                           | header   | true     |                    |                    |
| param                       | param                                  | body     | true     | HospitalQueryParam | HospitalQueryParam |
| &emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)     |                    |
| &emsp;&emsp;hosOriginName   | 原始名称                               |          | false    | string             |                    |
| &emsp;&emsp;hosStandardName | 标准名                                 |          | false    | string             |                    |
| &emsp;&emsp;pageNum         | 当前页数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;pageSize        | 每页条数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;queryId         | queryId                                |          | false    | integer(int64)     |                    |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取中心信息处理统计量

**接口地址**:`/lyqAdmin/api/admin/hospital/getStatData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| queryParam            | queryParam   | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema              |
| ------ | ------------ | ------------------- |
| 200    | OK           | Result«StatDataDto» |
| 201    | Created      |                     |
| 401    | Unauthorized |                     |
| 403    | Forbidden    |                     |
| 404    | Not Found    |                     |

**响应参数**:

| 参数名称                   | 参数说明   | 类型           | schema         |
| -------------------------- | ---------- | -------------- | -------------- |
| code                       |            | integer(int32) | integer(int32) |
| data                       |            | StatDataDto    | StatDataDto    |
| &emsp;&emsp;allTotal       | 总量       | integer(int64) |                |
| &emsp;&emsp;completedTotal | 已处理量   | integer(int64) |                |
| &emsp;&emsp;name           | 名称       | string         |                |
| &emsp;&emsp;otherTotal     | 其他数据量 | integer(int64) |                |
| &emsp;&emsp;pendingTotal   | 待处理量   | integer(int64) |                |
| msg                        |            | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"allTotal": 0,
		"completedTotal": 0,
		"name": "",
		"otherTotal": 0,
		"pendingTotal": 0
	},
	"msg": ""
}
```

## 中心(源数据)信息获取

**接口地址**:`/lyqAdmin/api/admin/hospital/pageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "hosOriginName": "",
  "hosStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0
}
```

**请求参数**:

| 参数名称                    | 参数说明                               | 请求类型 | 是否必须 | 数据类型           | schema             |
| --------------------------- | -------------------------------------- | -------- | -------- | ------------------ | ------------------ |
| Authorization               | 用户登录令牌                           | header   | true     |                    |                    |
| param                       | param                                  | body     | true     | HospitalQueryParam | HospitalQueryParam |
| &emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)     |                    |
| &emsp;&emsp;hosOriginName   | 原始名称                               |          | false    | string             |                    |
| &emsp;&emsp;hosStandardName | 标准名                                 |          | false    | string             |                    |
| &emsp;&emsp;pageNum         | 当前页数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;pageSize        | 每页条数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;queryId         | queryId                                |          | false    | integer(int64)     |                    |

**响应状态**:

| 状态码 | 说明         | schema                               |
| ------ | ------------ | ------------------------------------ |
| 200    | OK           | Result«BasePageVo«HospitalCleanDto»» |
| 201    | Created      |                                      |
| 401    | Unauthorized |                                      |
| 403    | Forbidden    |                                      |
| 404    | Not Found    |                                      |

**响应参数**:

| 参数名称                                | 参数说明                               | 类型                         | schema                       |
| --------------------------------------- | -------------------------------------- | ---------------------------- | ---------------------------- |
| code                                    |                                        | integer(int32)               | integer(int32)               |
| data                                    |                                        | BasePageVo«HospitalCleanDto» | BasePageVo«HospitalCleanDto» |
| &emsp;&emsp;list                        |                                        | array                        | HospitalCleanDto             |
| &emsp;&emsp;&emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 | integer                      |                              |
| &emsp;&emsp;&emsp;&emsp;cnt             | 统计次数                               | integer                      |                              |
| &emsp;&emsp;&emsp;&emsp;hosOriginName   | 原始名称                               | string                       |                              |
| &emsp;&emsp;&emsp;&emsp;hosStandardId   | 标准公司ID                             | integer                      |                              |
| &emsp;&emsp;&emsp;&emsp;hosStandardName | 标准名                                 | string                       |                              |
| &emsp;&emsp;&emsp;&emsp;id              | id                                     | integer                      |                              |
| &emsp;&emsp;&emsp;&emsp;remark          | 备注                                   | string                       |                              |
| &emsp;&emsp;&emsp;&emsp;updateTime      | 操作时间                               | string                       |                              |
| &emsp;&emsp;&emsp;&emsp;updater         | 操作人                                 | string                       |                              |
| &emsp;&emsp;pages                       |                                        | integer(int32)               |                              |
| &emsp;&emsp;total                       |                                        | integer(int64)               |                              |
| msg                                     |                                        | string                       |                              |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"cleanStatus": 0,
				"cnt": 0,
				"hosOriginName": "",
				"hosStandardId": 0,
				"hosStandardName": "",
				"id": 0,
				"remark": "",
				"updateTime": "",
				"updater": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取中心别名列表

**接口地址**:`/lyqAdmin/api/admin/hospital/queryOriginHospitalList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "hosOriginName": "",
  "hosStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0
}
```

**请求参数**:

| 参数名称                    | 参数说明                               | 请求类型 | 是否必须 | 数据类型           | schema             |
| --------------------------- | -------------------------------------- | -------- | -------- | ------------------ | ------------------ |
| Authorization               | 用户登录令牌                           | header   | true     |                    |                    |
| queryParam                  | queryParam                             | body     | true     | HospitalQueryParam | HospitalQueryParam |
| &emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)     |                    |
| &emsp;&emsp;hosOriginName   | 原始名称                               |          | false    | string             |                    |
| &emsp;&emsp;hosStandardName | 标准名                                 |          | false    | string             |                    |
| &emsp;&emsp;pageNum         | 当前页数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;pageSize        | 每页条数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;queryId         | queryId                                |          | false    | integer(int64)     |                    |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取中心字典(标准名)列表

**接口地址**:`/lyqAdmin/api/admin/hospital/queryStandardList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "hosOriginName": "",
  "hosStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0
}
```

**请求参数**:

| 参数名称                    | 参数说明                               | 请求类型 | 是否必须 | 数据类型           | schema             |
| --------------------------- | -------------------------------------- | -------- | -------- | ------------------ | ------------------ |
| Authorization               | 用户登录令牌                           | header   | true     |                    |                    |
| queryParam                  | queryParam                             | body     | true     | HospitalQueryParam | HospitalQueryParam |
| &emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)     |                    |
| &emsp;&emsp;hosOriginName   | 原始名称                               |          | false    | string             |                    |
| &emsp;&emsp;hosStandardName | 标准名                                 |          | false    | string             |                    |
| &emsp;&emsp;pageNum         | 当前页数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;pageSize        | 每页条数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;queryId         | queryId                                |          | false    | integer(int64)     |                    |

**响应状态**:

| 状态码 | 说明         | schema                                  |
| ------ | ------------ | --------------------------------------- |
| 200    | OK           | Result«BasePageVo«StandardHospitalDto»» |
| 201    | Created      |                                         |
| 401    | Unauthorized |                                         |
| 403    | Forbidden    |                                         |
| 404    | Not Found    |                                         |

**响应参数**:

| 参数名称                                | 参数说明                               | 类型                            | schema                          |
| --------------------------------------- | -------------------------------------- | ------------------------------- | ------------------------------- |
| code                                    |                                        | integer(int32)                  | integer(int32)                  |
| data                                    |                                        | BasePageVo«StandardHospitalDto» | BasePageVo«StandardHospitalDto» |
| &emsp;&emsp;list                        |                                        | array                           | StandardHospitalDto             |
| &emsp;&emsp;&emsp;&emsp;city            | 市                                     | string                          |                                 |
| &emsp;&emsp;&emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 | integer                         |                                 |
| &emsp;&emsp;&emsp;&emsp;cnt             | 统计次数                               | integer                         |                                 |
| &emsp;&emsp;&emsp;&emsp;hosShortName    | 简称                                   | string                          |                                 |
| &emsp;&emsp;&emsp;&emsp;hosStandardName | 标准名                                 | string                          |                                 |
| &emsp;&emsp;&emsp;&emsp;id              | id                                     | integer                         |                                 |
| &emsp;&emsp;&emsp;&emsp;province        | 省                                     | string                          |                                 |
| &emsp;&emsp;&emsp;&emsp;remark          | 备注                                   | string                          |                                 |
| &emsp;&emsp;&emsp;&emsp;updateTime      | 操作时间                               | string                          |                                 |
| &emsp;&emsp;&emsp;&emsp;updater         | 操作人                                 | string                          |                                 |
| &emsp;&emsp;pages                       |                                        | integer(int32)                  |                                 |
| &emsp;&emsp;total                       |                                        | integer(int64)                  |                                 |
| msg                                     |                                        | string                          |                                 |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"city": "",
				"cleanStatus": 0,
				"cnt": 0,
				"hosShortName": "",
				"hosStandardName": "",
				"id": 0,
				"province": "",
				"remark": "",
				"updateTime": "",
				"updater": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 中心信息手动清洗

**接口地址**:`/lyqAdmin/api/admin/hospital/saveClean`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "cnt": 0,
  "hosOriginName": "",
  "hosStandardId": 0,
  "hosStandardName": "",
  "id": 0,
  "remark": "",
  "updateTime": "",
  "updater": ""
}
```

**请求参数**:

| 参数名称                    | 参数说明                               | 请求类型 | 是否必须 | 数据类型          | schema           |
| --------------------------- | -------------------------------------- | -------- | -------- | ----------------- | ---------------- |
| Authorization               | 用户登录令牌                           | header   | true     |                   |                  |
| dto                         | dto                                    | body     | true     | HospitalCleanDto  | HospitalCleanDto |
| &emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)    |                  |
| &emsp;&emsp;cnt             | 统计次数                               |          | false    | integer(int32)    |                  |
| &emsp;&emsp;hosOriginName   | 原始名称                               |          | false    | string            |                  |
| &emsp;&emsp;hosStandardId   | 标准公司ID                             |          | false    | integer(int64)    |                  |
| &emsp;&emsp;hosStandardName | 标准名                                 |          | false    | string            |                  |
| &emsp;&emsp;id              | id                                     |          | false    | integer(int64)    |                  |
| &emsp;&emsp;remark          | 备注                                   |          | false    | string            |                  |
| &emsp;&emsp;updateTime      | 操作时间                               |          | false    | string(date-time) |                  |
| &emsp;&emsp;updater         | 操作人                                 |          | false    | string            |                  |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 中心(标准名)信息保存

**接口地址**:`/lyqAdmin/api/admin/hospital/saveStandardHospital`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "city": "",
  "cleanStatus": 0,
  "cnt": 0,
  "hosShortName": "",
  "hosStandardName": "",
  "id": 0,
  "province": "",
  "remark": "",
  "updateTime": "",
  "updater": ""
}
```

**请求参数**:

| 参数名称                    | 参数说明                               | 请求类型 | 是否必须 | 数据类型            | schema              |
| --------------------------- | -------------------------------------- | -------- | -------- | ------------------- | ------------------- |
| Authorization               | 用户登录令牌                           | header   | true     |                     |                     |
| dto                         | dto                                    | body     | true     | StandardHospitalDto | StandardHospitalDto |
| &emsp;&emsp;city            | 市                                     |          | false    | string              |                     |
| &emsp;&emsp;cleanStatus     | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)      |                     |
| &emsp;&emsp;cnt             | 统计次数                               |          | false    | integer(int32)      |                     |
| &emsp;&emsp;hosShortName    | 简称                                   |          | false    | string              |                     |
| &emsp;&emsp;hosStandardName | 标准名                                 |          | false    | string              |                     |
| &emsp;&emsp;id              | id                                     |          | false    | integer(int64)      |                     |
| &emsp;&emsp;province        | 省                                     |          | false    | string              |                     |
| &emsp;&emsp;remark          | 备注                                   |          | false    | string              |                     |
| &emsp;&emsp;updateTime      | 操作时间                               |          | false    | string(date-time)   |                     |
| &emsp;&emsp;updater         | 操作人                                 |          | false    | string              |                     |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 源名称拆分

**接口地址**:`/lyqAdmin/api/admin/hospital/spiltNames`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "hosOriginName": "",
  "id": 0,
  "spiltNames": [
    {
      "hosOriginName": "",
      "id": 0,
      "spiltNames": []
    }
  ]
}
```

**请求参数**:

| 参数名称                  | 参数说明     | 请求类型 | 是否必须 | 数据类型         | schema           |
| ------------------------- | ------------ | -------- | -------- | ---------------- | ---------------- |
| Authorization             | 用户登录令牌 | header   | true     |                  |                  |
| dto                       | dto          | body     | true     | SplitHospitalDto | SplitHospitalDto |
| &emsp;&emsp;hosOriginName | 医院原始名称 |          | false    | string           |                  |
| &emsp;&emsp;id            | id           |          | false    | integer(int64)   |                  |
| &emsp;&emsp;spiltNames    | 医院拆分名称 |          | false    | array            | SplitHospitalDto |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 修改清洗状态

**接口地址**:`/lyqAdmin/api/admin/hospital/updateCleanStatus`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "id": 0
}
```

**请求参数**:

| 参数名称                | 参数说明                               | 请求类型 | 是否必须 | 数据类型             | schema               |
| ----------------------- | -------------------------------------- | -------- | -------- | -------------------- | -------------------- |
| Authorization           | 用户登录令牌                           | header   | true     |                      |                      |
| updateCleanStatusDto    | updateCleanStatusDto                   | body     | true     | UpdateCleanStatusDto | UpdateCleanStatusDto |
| &emsp;&emsp;cleanStatus | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)       |                      |
| &emsp;&emsp;id          | id                                     |          | false    | integer(int64)       |                      |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

# 公司信息管理

## 获取关联登记号

**接口地址**:`/lyqAdmin/api/admin/company/getAcceptanceNos`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "companyName": "",
  "companyOriginName": "",
  "companyStandardName": "",
  "companyType": "",
  "onlyParent": 0,
  "pageNum": 0,
  "pageSize": 0,
  "parentCompanyId": 0,
  "parentCompanyShortName": "",
  "queryId": 0
}
```

**请求参数**:

| 参数名称                           | 参数说明                                | 请求类型 | 是否必须 | 数据类型          | schema            |
| ---------------------------------- | --------------------------------------- | -------- | -------- | ----------------- | ----------------- |
| Authorization                      | 用户登录令牌                            | header   | true     |                   |                   |
| param                              | param                                   | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗  |          | false    | integer(int32)    |                   |
| &emsp;&emsp;companyName            | 名称                                    |          | false    | string            |                   |
| &emsp;&emsp;companyOriginName      | 原始名称                                |          | false    | string            |                   |
| &emsp;&emsp;companyStandardName    | 标准名                                  |          | false    | string            |                   |
| &emsp;&emsp;companyType            | 类型(申办方,CRO,第三方实验室,药企,其他) |          | false    | string            |                   |
| &emsp;&emsp;onlyParent             | 只查询母公司,1-只查询母公司             |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageNum                | 当前页数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize               | 每页条数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;parentCompanyId        | 母公司ID                                |          | false    | integer(int64)    |                   |
| &emsp;&emsp;parentCompanyShortName | 母公司简称                              |          | false    | string            |                   |
| &emsp;&emsp;queryId                | queryId                                 |          | false    | integer(int64)    |                   |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取原始公司信息列表

**接口地址**:`/lyqAdmin/api/admin/company/getOriginCompanies`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "companyName": "",
  "companyOriginName": "",
  "companyStandardName": "",
  "companyType": "",
  "onlyParent": 0,
  "pageNum": 0,
  "pageSize": 0,
  "parentCompanyId": 0,
  "parentCompanyShortName": "",
  "queryId": 0
}
```

**请求参数**:

| 参数名称                           | 参数说明                                | 请求类型 | 是否必须 | 数据类型          | schema            |
| ---------------------------------- | --------------------------------------- | -------- | -------- | ----------------- | ----------------- |
| Authorization                      | 用户登录令牌                            | header   | true     |                   |                   |
| queryParam                         | queryParam                              | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗  |          | false    | integer(int32)    |                   |
| &emsp;&emsp;companyName            | 名称                                    |          | false    | string            |                   |
| &emsp;&emsp;companyOriginName      | 原始名称                                |          | false    | string            |                   |
| &emsp;&emsp;companyStandardName    | 标准名                                  |          | false    | string            |                   |
| &emsp;&emsp;companyType            | 类型(申办方,CRO,第三方实验室,药企,其他) |          | false    | string            |                   |
| &emsp;&emsp;onlyParent             | 只查询母公司,1-只查询母公司             |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageNum                | 当前页数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize               | 每页条数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;parentCompanyId        | 母公司ID                                |          | false    | integer(int64)    |                   |
| &emsp;&emsp;parentCompanyShortName | 母公司简称                              |          | false    | string            |                   |
| &emsp;&emsp;queryId                | queryId                                 |          | false    | integer(int64)    |                   |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取公司字典信息记录

**接口地址**:`/lyqAdmin/api/admin/company/getStandardCompany`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema |
| ------------- | ------------ | -------- | -------- | -------------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |                |        |
| id            | id           | query    | true     | integer(int64) |        |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«StandardCompanyDto» |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称                           | 参数说明                               | 类型               | schema             |
| ---------------------------------- | -------------------------------------- | ------------------ | ------------------ |
| code                               |                                        | integer(int32)     | integer(int32)     |
| data                               |                                        | StandardCompanyDto | StandardCompanyDto |
| &emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 | integer(int32)     |                    |
| &emsp;&emsp;cnt                    | 统计次数                               | integer(int32)     |                    |
| &emsp;&emsp;companyShortName       | 简称                                   | string             |                    |
| &emsp;&emsp;companyStandardName    | 标准名                                 | string             |                    |
| &emsp;&emsp;companyType            | 类型                                   | string             |                    |
| &emsp;&emsp;id                     | id                                     | integer(int64)     |                    |
| &emsp;&emsp;isParent               | 是否母公司,1-是                        | integer(int32)     |                    |
| &emsp;&emsp;parentCompanyId        | 父级ID                                 | integer(int64)     |                    |
| &emsp;&emsp;parentCompanyShortName | 父级简称                               | string             |                    |
| &emsp;&emsp;relation               | 关系                                   | string             |                    |
| &emsp;&emsp;remark                 | 备注                                   | string             |                    |
| &emsp;&emsp;updateTime             | 操作时间                               | string(date-time)  |                    |
| &emsp;&emsp;updater                | 操作人                                 | string             |                    |
| msg                                |                                        | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"cleanStatus": 0,
		"cnt": 0,
		"companyShortName": "",
		"companyStandardName": "",
		"companyType": "",
		"id": 0,
		"isParent": 0,
		"parentCompanyId": 0,
		"parentCompanyShortName": "",
		"relation": "",
		"remark": "",
		"updateTime": "",
		"updater": ""
	},
	"msg": ""
}
```

## 获取公司信息处理统计量

**接口地址**:`/lyqAdmin/api/admin/company/getStatData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| queryParam            | queryParam   | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema              |
| ------ | ------------ | ------------------- |
| 200    | OK           | Result«StatDataDto» |
| 201    | Created      |                     |
| 401    | Unauthorized |                     |
| 403    | Forbidden    |                     |
| 404    | Not Found    |                     |

**响应参数**:

| 参数名称                   | 参数说明   | 类型           | schema         |
| -------------------------- | ---------- | -------------- | -------------- |
| code                       |            | integer(int32) | integer(int32) |
| data                       |            | StatDataDto    | StatDataDto    |
| &emsp;&emsp;allTotal       | 总量       | integer(int64) |                |
| &emsp;&emsp;completedTotal | 已处理量   | integer(int64) |                |
| &emsp;&emsp;name           | 名称       | string         |                |
| &emsp;&emsp;otherTotal     | 其他数据量 | integer(int64) |                |
| &emsp;&emsp;pendingTotal   | 待处理量   | integer(int64) |                |
| msg                        |            | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"allTotal": 0,
		"completedTotal": 0,
		"name": "",
		"otherTotal": 0,
		"pendingTotal": 0
	},
	"msg": ""
}
```

## 公司信息查询

**接口地址**:`/lyqAdmin/api/admin/company/pageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "companyName": "",
  "companyOriginName": "",
  "companyStandardName": "",
  "companyType": "",
  "onlyParent": 0,
  "pageNum": 0,
  "pageSize": 0,
  "parentCompanyId": 0,
  "parentCompanyShortName": "",
  "queryId": 0
}
```

**请求参数**:

| 参数名称                           | 参数说明                                | 请求类型 | 是否必须 | 数据类型          | schema            |
| ---------------------------------- | --------------------------------------- | -------- | -------- | ----------------- | ----------------- |
| Authorization                      | 用户登录令牌                            | header   | true     |                   |                   |
| queryDto                           | queryDto                                | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗  |          | false    | integer(int32)    |                   |
| &emsp;&emsp;companyName            | 名称                                    |          | false    | string            |                   |
| &emsp;&emsp;companyOriginName      | 原始名称                                |          | false    | string            |                   |
| &emsp;&emsp;companyStandardName    | 标准名                                  |          | false    | string            |                   |
| &emsp;&emsp;companyType            | 类型(申办方,CRO,第三方实验室,药企,其他) |          | false    | string            |                   |
| &emsp;&emsp;onlyParent             | 只查询母公司,1-只查询母公司             |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageNum                | 当前页数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize               | 每页条数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;parentCompanyId        | 母公司ID                                |          | false    | integer(int64)    |                   |
| &emsp;&emsp;parentCompanyShortName | 母公司简称                              |          | false    | string            |                   |
| &emsp;&emsp;queryId                | queryId                                 |          | false    | integer(int64)    |                   |

**响应状态**:

| 状态码 | 说明         | schema                              |
| ------ | ------------ | ----------------------------------- |
| 200    | OK           | Result«BasePageVo«CleanCompanyDto»» |
| 201    | Created      |                                     |
| 401    | Unauthorized |                                     |
| 403    | Forbidden    |                                     |
| 404    | Not Found    |                                     |

**响应参数**:

| 参数名称                                       | 参数说明                               | 类型                        | schema                      |
| ---------------------------------------------- | -------------------------------------- | --------------------------- | --------------------------- |
| code                                           |                                        | integer(int32)              | integer(int32)              |
| data                                           |                                        | BasePageVo«CleanCompanyDto» | BasePageVo«CleanCompanyDto» |
| &emsp;&emsp;list                               |                                        | array                       | CleanCompanyDto             |
| &emsp;&emsp;&emsp;&emsp;acceptanceNo           |                                        | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;cnt                    | 统计次数                               | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;companyOriginName      | 源名称                                 | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyShortName       | 简称                                   | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名                                 | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyType            | 类型                                   | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;id                     | id                                     | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID                                 | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级简称                               | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;remark                 | 备注                                   | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;sources                | 来源                                   | array                       | string                      |
| &emsp;&emsp;&emsp;&emsp;standardId             | 标准公司ID                             | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;updateTime             | 操作时间                               | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;updater                | 操作人                                 | string                      |                             |
| &emsp;&emsp;pages                              |                                        | integer(int32)              |                             |
| &emsp;&emsp;total                              |                                        | integer(int64)              |                             |
| msg                                            |                                        | string                      |                             |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"acceptanceNo": "",
				"cleanStatus": 0,
				"cnt": 0,
				"companyOriginName": "",
				"companyShortName": "",
				"companyStandardName": "",
				"companyType": "",
				"id": 0,
				"parentCompanyId": 0,
				"parentCompanyShortName": "",
				"remark": "",
				"sources": [],
				"standardId": 0,
				"updateTime": "",
				"updater": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 母公司合并(转移)

**接口地址**:`/lyqAdmin/api/admin/company/parentCompanyMerge`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "sourceStandardId": 0,
  "sourceStandardName": "",
  "targetStandardId": 0,
  "targetStandardName": ""
}
```

**请求参数**:

| 参数名称                       | 参数说明                     | 请求类型 | 是否必须 | 数据类型              | schema                |
| ------------------------------ | ---------------------------- | -------- | -------- | --------------------- | --------------------- |
| Authorization                  | 用户登录令牌                 | header   | true     |                       |                       |
| dto                            | dto                          | body     | true     | ParentCompanyMergeDto | ParentCompanyMergeDto |
| &emsp;&emsp;sourceStandardId   | 来源ID(需要合并的公司)       |          | false    | integer(int64)        |                       |
| &emsp;&emsp;sourceStandardName | 来源公司名称(需要合并的公司) |          | false    | string                |                       |
| &emsp;&emsp;targetStandardId   | 目的ID(合并后的公司)         |          | false    | integer(int64)        |                       |
| &emsp;&emsp;targetStandardName | 目的公司名称(合并后的公司)   |          | false    | string                |                       |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 公司标准信息获取

**接口地址**:`/lyqAdmin/api/admin/company/queryByName`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                              |
| ------ | ------------ | ----------------------------------- |
| 200    | OK           | Result«BasePageVo«CompanyShortDto»» |
| 201    | Created      |                                     |
| 401    | Unauthorized |                                     |
| 403    | Forbidden    |                                     |
| 404    | Not Found    |                                     |

**响应参数**:

| 参数名称                                       | 参数说明     | 类型                        | schema                      |
| ---------------------------------------------- | ------------ | --------------------------- | --------------------------- |
| code                                           |              | integer(int32)              | integer(int32)              |
| data                                           |              | BasePageVo«CompanyShortDto» | BasePageVo«CompanyShortDto» |
| &emsp;&emsp;list                               |              | array                       | CompanyShortDto             |
| &emsp;&emsp;&emsp;&emsp;companyShortName       | 简称         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名       | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyType            | 类型         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID       | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级公司简称 | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;standardId             | 标准库ID     | integer                     |                             |
| &emsp;&emsp;pages                              |              | integer(int32)              |                             |
| &emsp;&emsp;total                              |              | integer(int64)              |                             |
| msg                                            |              | string                      |                             |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"companyShortName": "",
				"companyStandardName": "",
				"companyType": "",
				"parentCompanyId": 0,
				"parentCompanyShortName": "",
				"standardId": 0
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取母公司数据

**接口地址**:`/lyqAdmin/api/admin/company/queryParentData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                              |
| ------ | ------------ | ----------------------------------- |
| 200    | OK           | Result«BasePageVo«CompanyShortDto»» |
| 201    | Created      |                                     |
| 401    | Unauthorized |                                     |
| 403    | Forbidden    |                                     |
| 404    | Not Found    |                                     |

**响应参数**:

| 参数名称                                       | 参数说明     | 类型                        | schema                      |
| ---------------------------------------------- | ------------ | --------------------------- | --------------------------- |
| code                                           |              | integer(int32)              | integer(int32)              |
| data                                           |              | BasePageVo«CompanyShortDto» | BasePageVo«CompanyShortDto» |
| &emsp;&emsp;list                               |              | array                       | CompanyShortDto             |
| &emsp;&emsp;&emsp;&emsp;companyShortName       | 简称         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名       | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyType            | 类型         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID       | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级公司简称 | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;standardId             | 标准库ID     | integer                     |                             |
| &emsp;&emsp;pages                              |              | integer(int32)              |                             |
| &emsp;&emsp;total                              |              | integer(int64)              |                             |
| msg                                            |              | string                      |                             |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"companyShortName": "",
				"companyStandardName": "",
				"companyType": "",
				"parentCompanyId": 0,
				"parentCompanyShortName": "",
				"standardId": 0
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取公司字典(标准名)列表

**接口地址**:`/lyqAdmin/api/admin/company/queryStandardList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "companyName": "",
  "companyOriginName": "",
  "companyStandardName": "",
  "companyType": "",
  "onlyParent": 0,
  "pageNum": 0,
  "pageSize": 0,
  "parentCompanyId": 0,
  "parentCompanyShortName": "",
  "queryId": 0
}
```

**请求参数**:

| 参数名称                           | 参数说明                                | 请求类型 | 是否必须 | 数据类型          | schema            |
| ---------------------------------- | --------------------------------------- | -------- | -------- | ----------------- | ----------------- |
| Authorization                      | 用户登录令牌                            | header   | true     |                   |                   |
| queryParam                         | queryParam                              | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗  |          | false    | integer(int32)    |                   |
| &emsp;&emsp;companyName            | 名称                                    |          | false    | string            |                   |
| &emsp;&emsp;companyOriginName      | 原始名称                                |          | false    | string            |                   |
| &emsp;&emsp;companyStandardName    | 标准名                                  |          | false    | string            |                   |
| &emsp;&emsp;companyType            | 类型(申办方,CRO,第三方实验室,药企,其他) |          | false    | string            |                   |
| &emsp;&emsp;onlyParent             | 只查询母公司,1-只查询母公司             |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageNum                | 当前页数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize               | 每页条数                                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;parentCompanyId        | 母公司ID                                |          | false    | integer(int64)    |                   |
| &emsp;&emsp;parentCompanyShortName | 母公司简称                              |          | false    | string            |                   |
| &emsp;&emsp;queryId                | queryId                                 |          | false    | integer(int64)    |                   |

**响应状态**:

| 状态码 | 说明         | schema                                 |
| ------ | ------------ | -------------------------------------- |
| 200    | OK           | Result«BasePageVo«StandardCompanyDto»» |
| 201    | Created      |                                        |
| 401    | Unauthorized |                                        |
| 403    | Forbidden    |                                        |
| 404    | Not Found    |                                        |

**响应参数**:

| 参数名称                                       | 参数说明                               | 类型                           | schema                         |
| ---------------------------------------------- | -------------------------------------- | ------------------------------ | ------------------------------ |
| code                                           |                                        | integer(int32)                 | integer(int32)                 |
| data                                           |                                        | BasePageVo«StandardCompanyDto» | BasePageVo«StandardCompanyDto» |
| &emsp;&emsp;list                               |                                        | array                          | StandardCompanyDto             |
| &emsp;&emsp;&emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;cnt                    | 统计次数                               | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;companyShortName       | 简称                                   | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名                                 | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;companyType            | 类型                                   | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;id                     | id                                     | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;isParent               | 是否母公司,1-是                        | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID                                 | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级简称                               | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;relation               | 关系                                   | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;remark                 | 备注                                   | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;updateTime             | 操作时间                               | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;updater                | 操作人                                 | string                         |                                |
| &emsp;&emsp;pages                              |                                        | integer(int32)                 |                                |
| &emsp;&emsp;total                              |                                        | integer(int64)                 |                                |
| msg                                            |                                        | string                         |                                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"cleanStatus": 0,
				"cnt": 0,
				"companyShortName": "",
				"companyStandardName": "",
				"companyType": "",
				"id": 0,
				"isParent": 0,
				"parentCompanyId": 0,
				"parentCompanyShortName": "",
				"relation": "",
				"remark": "",
				"updateTime": "",
				"updater": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取标准公司信息(排除掉母公司)

**接口地址**:`/lyqAdmin/api/admin/company/queryStandardWithoutParent`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                              |
| ------ | ------------ | ----------------------------------- |
| 200    | OK           | Result«BasePageVo«CompanyShortDto»» |
| 201    | Created      |                                     |
| 401    | Unauthorized |                                     |
| 403    | Forbidden    |                                     |
| 404    | Not Found    |                                     |

**响应参数**:

| 参数名称                                       | 参数说明     | 类型                        | schema                      |
| ---------------------------------------------- | ------------ | --------------------------- | --------------------------- |
| code                                           |              | integer(int32)              | integer(int32)              |
| data                                           |              | BasePageVo«CompanyShortDto» | BasePageVo«CompanyShortDto» |
| &emsp;&emsp;list                               |              | array                       | CompanyShortDto             |
| &emsp;&emsp;&emsp;&emsp;companyShortName       | 简称         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名       | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyType            | 类型         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID       | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级公司简称 | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;standardId             | 标准库ID     | integer                     |                             |
| &emsp;&emsp;pages                              |              | integer(int32)              |                             |
| &emsp;&emsp;total                              |              | integer(int64)              |                             |
| msg                                            |              | string                      |                             |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"companyShortName": "",
				"companyStandardName": "",
				"companyType": "",
				"parentCompanyId": 0,
				"parentCompanyShortName": "",
				"standardId": 0
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 公司信息手动清洗

**接口地址**:`/lyqAdmin/api/admin/company/saveClean`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "acceptanceNo": "",
  "cleanStatus": 0,
  "cnt": 0,
  "companyOriginName": "",
  "companyShortName": "",
  "companyStandardName": "",
  "companyType": "",
  "id": 0,
  "parentCompanyId": 0,
  "parentCompanyShortName": "",
  "remark": "",
  "sources": [],
  "standardId": 0,
  "updateTime": "",
  "updater": ""
}
```

**请求参数**:

| 参数名称                           | 参数说明                               | 请求类型 | 是否必须 | 数据类型          | schema          |
| ---------------------------------- | -------------------------------------- | -------- | -------- | ----------------- | --------------- |
| Authorization                      | 用户登录令牌                           | header   | true     |                   |                 |
| dto                                | dto                                    | body     | true     | CleanCompanyDto   | CleanCompanyDto |
| &emsp;&emsp;acceptanceNo           |                                        |          | false    | string            |                 |
| &emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)    |                 |
| &emsp;&emsp;cnt                    | 统计次数                               |          | false    | integer(int32)    |                 |
| &emsp;&emsp;companyOriginName      | 源名称                                 |          | false    | string            |                 |
| &emsp;&emsp;companyShortName       | 简称                                   |          | false    | string            |                 |
| &emsp;&emsp;companyStandardName    | 标准名                                 |          | false    | string            |                 |
| &emsp;&emsp;companyType            | 类型                                   |          | false    | string            |                 |
| &emsp;&emsp;id                     | id                                     |          | false    | integer(int64)    |                 |
| &emsp;&emsp;parentCompanyId        | 父级ID                                 |          | false    | integer(int64)    |                 |
| &emsp;&emsp;parentCompanyShortName | 父级简称                               |          | false    | string            |                 |
| &emsp;&emsp;remark                 | 备注                                   |          | false    | string            |                 |
| &emsp;&emsp;sources                | 来源                                   |          | false    | array             | string          |
| &emsp;&emsp;standardId             | 标准公司ID                             |          | false    | integer(int64)    |                 |
| &emsp;&emsp;updateTime             | 操作时间                               |          | false    | string(date-time) |                 |
| &emsp;&emsp;updater                | 操作人                                 |          | false    | string            |                 |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 母公司信息保存

**接口地址**:`/lyqAdmin/api/admin/company/saveParentCompany`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyType": "",
  "id": 0,
  "parentCompanyShortName": ""
}
```

**请求参数**:

| 参数名称                           | 参数说明     | 请求类型 | 是否必须 | 数据类型         | schema           |
| ---------------------------------- | ------------ | -------- | -------- | ---------------- | ---------------- |
| Authorization                      | 用户登录令牌 | header   | true     |                  |                  |
| dto                                | dto          | body     | true     | ParentCompanyDto | ParentCompanyDto |
| &emsp;&emsp;companyType            | 公司类型     |          | false    | string           |                  |
| &emsp;&emsp;id                     | id           |          | false    | integer(int64)   |                  |
| &emsp;&emsp;parentCompanyShortName | 母公司简称   |          | false    | string           |                  |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 公司字典(标准名)信息保存

**接口地址**:`/lyqAdmin/api/admin/company/saveStandardCompany`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "cnt": 0,
  "companyShortName": "",
  "companyStandardName": "",
  "companyType": "",
  "id": 0,
  "isParent": 0,
  "parentCompanyId": 0,
  "parentCompanyShortName": "",
  "relation": "",
  "remark": "",
  "updateTime": "",
  "updater": ""
}
```

**请求参数**:

| 参数名称                           | 参数说明                               | 请求类型 | 是否必须 | 数据类型           | schema             |
| ---------------------------------- | -------------------------------------- | -------- | -------- | ------------------ | ------------------ |
| Authorization                      | 用户登录令牌                           | header   | true     |                    |                    |
| dto                                | dto                                    | body     | true     | StandardCompanyDto | StandardCompanyDto |
| &emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)     |                    |
| &emsp;&emsp;cnt                    | 统计次数                               |          | false    | integer(int32)     |                    |
| &emsp;&emsp;companyShortName       | 简称                                   |          | false    | string             |                    |
| &emsp;&emsp;companyStandardName    | 标准名                                 |          | false    | string             |                    |
| &emsp;&emsp;companyType            | 类型                                   |          | false    | string             |                    |
| &emsp;&emsp;id                     | id                                     |          | false    | integer(int64)     |                    |
| &emsp;&emsp;isParent               | 是否母公司,1-是                        |          | false    | integer(int32)     |                    |
| &emsp;&emsp;parentCompanyId        | 父级ID                                 |          | false    | integer(int64)     |                    |
| &emsp;&emsp;parentCompanyShortName | 父级简称                               |          | false    | string             |                    |
| &emsp;&emsp;relation               | 关系                                   |          | false    | string             |                    |
| &emsp;&emsp;remark                 | 备注                                   |          | false    | string             |                    |
| &emsp;&emsp;updateTime             | 操作时间                               |          | false    | string(date-time)  |                    |
| &emsp;&emsp;updater                | 操作人                                 |          | false    | string             |                    |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 源名称拆分

**接口地址**:`/lyqAdmin/api/admin/company/spiltNames`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyOriginName": "",
  "id": 0,
  "spiltNames": [
    {
      "companyOriginName": "",
      "id": 0,
      "spiltNames": []
    }
  ]
}
```

**请求参数**:

| 参数名称                      | 参数说明     | 请求类型 | 是否必须 | 数据类型        | schema          |
| ----------------------------- | ------------ | -------- | -------- | --------------- | --------------- |
| Authorization                 | 用户登录令牌 | header   | true     |                 |                 |
| dto                           | dto          | body     | true     | SplitCompanyDto | SplitCompanyDto |
| &emsp;&emsp;companyOriginName | 公司原始名称 |          | false    | string          |                 |
| &emsp;&emsp;id                | id           |          | false    | integer(int64)  |                 |
| &emsp;&emsp;spiltNames        | 公司拆分名称 |          | false    | array           | SplitCompanyDto |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 修改清洗状态

**接口地址**:`/lyqAdmin/api/admin/company/updateCleanStatus`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "id": 0
}
```

**请求参数**:

| 参数名称                | 参数说明                               | 请求类型 | 是否必须 | 数据类型             | schema               |
| ----------------------- | -------------------------------------- | -------- | -------- | -------------------- | -------------------- |
| Authorization           | 用户登录令牌                           | header   | true     |                      |                      |
| updateCleanStatusDto    | updateCleanStatusDto                   | body     | true     | UpdateCleanStatusDto | UpdateCleanStatusDto |
| &emsp;&emsp;cleanStatus | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)       |                      |
| &emsp;&emsp;id          | id                                     |          | false    | integer(int64)       |                      |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

# 用户信息管理

## 获取用户信息

**接口地址**:`/lyqAdmin/api/adminUser/info`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«UserDto» |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称             | 参数说明 | 类型           | schema         |
| -------------------- | -------- | -------------- | -------------- |
| code                 |          | integer(int32) | integer(int32) |
| data                 |          | UserDto        | UserDto        |
| &emsp;&emsp;nickName |          | string         |                |
| &emsp;&emsp;roles    |          | array          | string         |
| &emsp;&emsp;token    |          | string         |                |
| &emsp;&emsp;userId   |          | integer(int64) |                |
| &emsp;&emsp;username |          | string         |                |
| msg                  |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"nickName": "",
		"roles": [],
		"token": "",
		"userId": 0,
		"username": ""
	},
	"msg": ""
}
```

## 修改密码

**接口地址**:`/lyqAdmin/api/adminUser/updatePwd`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "confirmPwd": "",
  "newPwd": "",
  "oldPwd": ""
}
```

**请求参数**:

| 参数名称               | 参数说明     | 请求类型 | 是否必须 | 数据类型     | schema       |
| ---------------------- | ------------ | -------- | -------- | ------------ | ------------ |
| Authorization          | 用户登录令牌 | header   | true     |              |              |
| dto                    | dto          | body     | true     | 修改密码参数 | 修改密码参数 |
| &emsp;&emsp;confirmPwd | 确认密码     |          | false    | string       |              |
| &emsp;&emsp;newPwd     | 新密码       |          | false    | string       |              |
| &emsp;&emsp;oldPwd     | 旧密码       |          | false    | string       |              |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

# 用户管理

## 编辑VIP信息

**接口地址**:`/lyqAdmin/api/admin/wxUserManage/editUserVIP`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "vipBeginTime": "",
  "vipCode": 0,
  "vipEndTime": ""
}
```

**请求参数**:

| 参数名称                 | 参数说明                                  | 请求类型 | 是否必须 | 数据类型          | schema       |
| ------------------------ | ----------------------------------------- | -------- | -------- | ----------------- | ------------ |
| Authorization            | 用户登录令牌                              | header   | true     |                   |              |
| param                    | param                                     | body     | true     | EditVipParam      | EditVipParam |
| &emsp;&emsp;id           | ID                                        |          | false    | integer(int64)    |              |
| &emsp;&emsp;pageNum      | 当前页数                                  |          | false    | integer(int32)    |              |
| &emsp;&emsp;pageSize     | 每页条数                                  |          | false    | integer(int32)    |              |
| &emsp;&emsp;vipBeginTime | 会员开始时间                              |          | false    | string(date-time) |              |
| &emsp;&emsp;vipCode      | 会员编码 0-普通用户 1-VIP试用,100-VIP用户 |          | false    | integer(int32)    |              |
| &emsp;&emsp;vipEndTime   | 会员结束时间                              |          | false    | string(date-time) |              |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 微信用户列表

**接口地址**:`/lyqAdmin/api/admin/wxUserManage/pageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "nickname": "",
  "pageNum": 0,
  "pageSize": 0,
  "phone": "",
  "username": "",
  "vipCode": 0
}
```

**请求参数**:

| 参数名称             | 参数说明     | 请求类型 | 是否必须 | 数据类型         | schema           |
| -------------------- | ------------ | -------- | -------- | ---------------- | ---------------- |
| Authorization        | 用户登录令牌 | header   | true     |                  |                  |
| param                | param        | body     | true     | WxUserQueryParam | WxUserQueryParam |
| &emsp;&emsp;nickname | 微信昵称     |          | false    | string           |                  |
| &emsp;&emsp;pageNum  | 当前页数     |          | false    | integer(int32)   |                  |
| &emsp;&emsp;pageSize | 每页条数     |          | false    | integer(int32)   |                  |
| &emsp;&emsp;phone    | 手机号       |          | false    | string           |                  |
| &emsp;&emsp;username | 用户名称     |          | false    | string           |                  |
| &emsp;&emsp;vipCode  | 会员编号     |          | false    | integer(int32)   |                  |

**响应状态**:

| 状态码 | 说明         | schema                        |
| ------ | ------------ | ----------------------------- |
| 200    | OK           | Result«BasePageVo«WxUserDto»» |
| 201    | Created      |                               |
| 401    | Unauthorized |                               |
| 403    | Forbidden    |                               |
| 404    | Not Found    |                               |

**响应参数**:

| 参数名称                                          | 参数说明                             | 类型                  | schema                |
| ------------------------------------------------- | ------------------------------------ | --------------------- | --------------------- |
| code                                              |                                      | integer(int32)        | integer(int32)        |
| data                                              |                                      | BasePageVo«WxUserDto» | BasePageVo«WxUserDto» |
| &emsp;&emsp;list                                  |                                      | array                 | WxUserDto             |
| &emsp;&emsp;&emsp;&emsp;authDto                   | 单个小程序授权信息                   | WxUserAuthDto         | WxUserAuthDto         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;appId         |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authBeginTime |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authDays      |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authEndTime   |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authLevel     |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id            |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;levelCd       |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;unionId       |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;wxUserId      |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;authDtoList               | 多个小程序授权信息                   | array                 | WxUserAuthDto         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;appId         |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authBeginTime |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authDays      |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authEndTime   |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;authLevel     |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id            |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;levelCd       |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;unionId       |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;wxUserId      |                                      | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;avatarUrl                 | 用户头像URL                          | string                |                       |
| &emsp;&emsp;&emsp;&emsp;city                      | 市                                   | string                |                       |
| &emsp;&emsp;&emsp;&emsp;createTime                | 创建时间(首次登录时间)               | string                |                       |
| &emsp;&emsp;&emsp;&emsp;enable                    | 是否可用 0-不可用，1-可用            | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;id                        | 主键ID                               | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;lastLoginTime             | 最后登录时间                         | string                |                       |
| &emsp;&emsp;&emsp;&emsp;levelCd                   | 会员等级                             | integer               |                       |
| &emsp;&emsp;&emsp;&emsp;nickname                  | 用户昵称                             | string                |                       |
| &emsp;&emsp;&emsp;&emsp;openid                    | 微信小程序唯一标识（每个小程序独立） | string                |                       |
| &emsp;&emsp;&emsp;&emsp;phone                     | 用户手机号                           | string                |                       |
| &emsp;&emsp;&emsp;&emsp;province                  | 省                                   | string                |                       |
| &emsp;&emsp;&emsp;&emsp;unionid                   | 微信开放平台唯一标识（多端统一）     | string                |                       |
| &emsp;&emsp;&emsp;&emsp;userApps                  | 使用小程序信息                       | array                 | WxAppDto              |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;appId         |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;appName       |                                      | string                |                       |
| &emsp;&emsp;&emsp;&emsp;userRole                  | 用户角色                             | string                |                       |
| &emsp;&emsp;&emsp;&emsp;username                  | 账号                                 | string                |                       |
| &emsp;&emsp;&emsp;&emsp;vipBeginTime              | 会员开始时间                         | string                |                       |
| &emsp;&emsp;&emsp;&emsp;vipDesc                   | 会员描述                             | string                |                       |
| &emsp;&emsp;&emsp;&emsp;vipEndTime                | 会员结束时间                         | string                |                       |
| &emsp;&emsp;&emsp;&emsp;wxNickname                | 微信昵称                             | string                |                       |
| &emsp;&emsp;pages                                 |                                      | integer(int32)        |                       |
| &emsp;&emsp;total                                 |                                      | integer(int64)        |                       |
| msg                                               |                                      | string                |                       |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"authDto": {
					"appId": "",
					"authBeginTime": "",
					"authDays": 0,
					"authEndTime": "",
					"authLevel": "",
					"id": 0,
					"levelCd": 0,
					"unionId": "",
					"wxUserId": 0
				},
				"authDtoList": [
					{
						"appId": "",
						"authBeginTime": "",
						"authDays": 0,
						"authEndTime": "",
						"authLevel": "",
						"id": 0,
						"levelCd": 0,
						"unionId": "",
						"wxUserId": 0
					}
				],
				"avatarUrl": "",
				"city": "",
				"createTime": "",
				"enable": 0,
				"id": 0,
				"lastLoginTime": "",
				"levelCd": 0,
				"nickname": "",
				"openid": "",
				"phone": "",
				"province": "",
				"unionid": "",
				"userApps": [
					{
						"appId": "",
						"appName": ""
					}
				],
				"userRole": "",
				"username": "",
				"vipBeginTime": "",
				"vipDesc": "",
				"vipEndTime": "",
				"wxNickname": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

# 申请试用管理

## 申请审批

**接口地址**:`/lyqAdmin/api/admin/vipApplication/approval`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>只需填id,审批状态(2审批通过,3审批不通过),审批备注</p>

**请求示例**:

```javascript
{
  "applicateDate": "",
  "approvalDate": "",
  "approvalRemark": "",
  "approvalStatus": 0,
  "id": 0,
  "userCompany": "",
  "userId": 0,
  "userName": "",
  "userPhone": "",
  "userPosition": ""
}
```

**请求参数**:

| 参数名称                   | 参数说明                                 | 请求类型 | 是否必须 | 数据类型          | schema         |
| -------------------------- | ---------------------------------------- | -------- | -------- | ----------------- | -------------- |
| Authorization              | 用户登录令牌                             | header   | true     |                   |                |
| vipApplication             | vipApplication                           | body     | true     | VipApplication    | VipApplication |
| &emsp;&emsp;applicateDate  | 申请日期                                 |          | false    | string(date-time) |                |
| &emsp;&emsp;approvalDate   | 审批日期                                 |          | false    | string(date-time) |                |
| &emsp;&emsp;approvalRemark | 审批备注                                 |          | false    | string            |                |
| &emsp;&emsp;approvalStatus | 审批状态(1:待审批,2审批通过,3审批不通过) |          | false    | integer(int32)    |                |
| &emsp;&emsp;id             | 申请记录id                               |          | false    | integer(int32)    |                |
| &emsp;&emsp;userCompany    | 用户公司                                 |          | false    | string            |                |
| &emsp;&emsp;userId         | 用户id                                   |          | false    | integer(int64)    |                |
| &emsp;&emsp;userName       | 用户姓名                                 |          | false    | string            |                |
| &emsp;&emsp;userPhone      | 用户手机号                               |          | false    | string            |                |
| &emsp;&emsp;userPosition   | 用户职位                                 |          | false    | string            |                |

**响应状态**:

| 状态码 | 说明         | schema    |
| ------ | ------------ | --------- |
| 200    | OK           | Result«T» |
| 201    | Created      |           |
| 401    | Unauthorized |           |
| 403    | Forbidden    |           |
| 404    | Not Found    |           |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | T              | T              |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {},
	"msg": ""
}
```

## 查询审批记录

**接口地址**:`/lyqAdmin/api/admin/vipApplication/getVipApplicationList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "approvalStatus": 0,
  "pageNum": 0,
  "pageSize": 0,
  "userCompany": "",
  "userName": "",
  "userPhone": ""
}
```

**请求参数**:

| 参数名称                   | 参数说明                                 | 请求类型 | 是否必须 | 数据类型                 | schema                   |
| -------------------------- | ---------------------------------------- | -------- | -------- | ------------------------ | ------------------------ |
| Authorization              | 用户登录令牌                             | header   | true     |                          |                          |
| vipApplicationReq          | vipApplicationReq                        | body     | true     | 申请试用审批记录请求对象 | 申请试用审批记录请求对象 |
| &emsp;&emsp;approvalStatus | 审批状态(1:待审批,2审批通过,3审批不通过) |          | false    | integer(int32)           |                          |
| &emsp;&emsp;pageNum        | 当前页数                                 |          | false    | integer(int32)           |                          |
| &emsp;&emsp;pageSize       | 每页条数                                 |          | false    | integer(int32)           |                          |
| &emsp;&emsp;userCompany    | 用户公司                                 |          | false    | string                   |                          |
| &emsp;&emsp;userName       | 用户姓名                                 |          | false    | string                   |                          |
| &emsp;&emsp;userPhone      | 用户手机号                               |          | false    | string                   |                          |

**响应状态**:

| 状态码 | 说明         | schema                             |
| ------ | ------------ | ---------------------------------- |
| 200    | OK           | Result«BasePageVo«VipApplication»» |
| 201    | Created      |                                    |
| 401    | Unauthorized |                                    |
| 403    | Forbidden    |                                    |
| 404    | Not Found    |                                    |

**响应参数**:

| 参数名称                               | 参数说明                                 | 类型                       | schema                     |
| -------------------------------------- | ---------------------------------------- | -------------------------- | -------------------------- |
| code                                   |                                          | integer(int32)             | integer(int32)             |
| data                                   |                                          | BasePageVo«VipApplication» | BasePageVo«VipApplication» |
| &emsp;&emsp;list                       |                                          | array                      | VipApplication             |
| &emsp;&emsp;&emsp;&emsp;applicateDate  | 申请日期                                 | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;approvalDate   | 审批日期                                 | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;approvalRemark | 审批备注                                 | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;approvalStatus | 审批状态(1:待审批,2审批通过,3审批不通过) | integer                    |                            |
| &emsp;&emsp;&emsp;&emsp;id             | 申请记录id                               | integer                    |                            |
| &emsp;&emsp;&emsp;&emsp;userCompany    | 用户公司                                 | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;userId         | 用户id                                   | integer                    |                            |
| &emsp;&emsp;&emsp;&emsp;userName       | 用户姓名                                 | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;userPhone      | 用户手机号                               | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;userPosition   | 用户职位                                 | string                     |                            |
| &emsp;&emsp;pages                      |                                          | integer(int32)             |                            |
| &emsp;&emsp;total                      |                                          | integer(int64)             |                            |
| msg                                    |                                          | string                     |                            |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"applicateDate": "",
				"approvalDate": "",
				"approvalRemark": "",
				"approvalStatus": 0,
				"id": 0,
				"userCompany": "",
				"userId": 0,
				"userName": "",
				"userPhone": "",
				"userPosition": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

# 登录管理

## 获取验证码

**接口地址**:`/lyqAdmin/api/adminLogin/captcha`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |

**响应状态**:

| 状态码 | 说明         | schema |
| ------ | ------------ | ------ |
| 200    | OK           |        |
| 401    | Unauthorized |        |
| 403    | Forbidden    |        |
| 404    | Not Found    |        |

**响应参数**:

暂无

**响应示例**:

```javascript

```

## 登录以后返回token

**接口地址**:`/lyqAdmin/api/adminLogin/login`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "captcha": "",
  "captchaKey": "",
  "password": "",
  "username": ""
}
```

**请求参数**:

| 参数名称               | 参数说明     | 请求类型 | 是否必须 | 数据类型     | schema       |
| ---------------------- | ------------ | -------- | -------- | ------------ | ------------ |
| Authorization          | 用户登录令牌 | header   | true     |              |              |
| loginRequest           | loginRequest | body     | true     | LoginRequest | LoginRequest |
| &emsp;&emsp;captcha    |              |          | false    | string       |              |
| &emsp;&emsp;captchaKey |              |          | false    | string       |              |
| &emsp;&emsp;password   |              |          | false    | string       |              |
| &emsp;&emsp;username   |              |          | false    | string       |              |

**响应状态**:

| 状态码 | 说明         | schema         |
| ------ | ------------ | -------------- |
| 200    | OK           | Result«object» |
| 201    | Created      |                |
| 401    | Unauthorized |                |
| 403    | Forbidden    |                |
| 404    | Not Found    |                |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | object         |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {},
	"msg": ""
}
```

## 登出功能

**接口地址**:`/lyqAdmin/api/adminLogin/logout`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |

**响应状态**:

| 状态码 | 说明         | schema         |
| ------ | ------------ | -------------- |
| 200    | OK           | Result«object» |
| 401    | Unauthorized |                |
| 403    | Forbidden    |                |
| 404    | Not Found    |                |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | object         |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {},
	"msg": ""
}
```

## 刷新token

**接口地址**:`/lyqAdmin/api/adminLogin/refreshToken`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |

**响应状态**:

| 状态码 | 说明         | schema         |
| ------ | ------------ | -------------- |
| 200    | OK           | Result«object» |
| 401    | Unauthorized |                |
| 403    | Forbidden    |                |
| 404    | Not Found    |                |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | object         |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {},
	"msg": ""
}
```

# 药物信息管理

## 登记号&企业列表

**接口地址**:`/lyqAdmin/api/admin/drug/acceptanceNoList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                                |
| ------ | ------------ | ------------------------------------- |
| 200    | OK           | Result«BasePageVo«DrugAcceptanceDto»» |
| 201    | Created      |                                       |
| 401    | Unauthorized |                                       |
| 403    | Forbidden    |                                       |
| 404    | Not Found    |                                       |

**响应参数**:

| 参数名称                                            | 参数说明           | 类型                          | schema                        |
| --------------------------------------------------- | ------------------ | ----------------------------- | ----------------------------- |
| code                                                |                    | integer(int32)                | integer(int32)                |
| data                                                |                    | BasePageVo«DrugAcceptanceDto» | BasePageVo«DrugAcceptanceDto» |
| &emsp;&emsp;list                                    |                    | array                         | DrugAcceptanceDto             |
| &emsp;&emsp;&emsp;&emsp;acceptanceNo                | 先关登记号/备案号  | string                        |                               |
| &emsp;&emsp;&emsp;&emsp;companyNameOrigin           | 相关公司（源数据） | string                        |                               |
| &emsp;&emsp;&emsp;&emsp;registrationCategoryCleaned | 注册分类（清洗后） | string                        |                               |
| &emsp;&emsp;&emsp;&emsp;registrationCategoryOrigin  | 注册分类（源数据） | string                        |                               |
| &emsp;&emsp;pages                                   |                    | integer(int32)                |                               |
| &emsp;&emsp;total                                   |                    | integer(int64)                |                               |
| msg                                                 |                    | string                        |                               |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"acceptanceNo": "",
				"companyNameOrigin": "",
				"registrationCategoryCleaned": "",
				"registrationCategoryOrigin": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 药品清洗列表

**接口地址**:`/lyqAdmin/api/admin/drug/cleanPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "drugComment": "",
  "drugCommentId": 0,
  "drugStandardId": 0,
  "drugStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "parentCompanyId": 0,
  "standardCompanyId": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                      | 参数说明                           | 请求类型 | 是否必须 | 数据类型       | schema         |
| ----------------------------- | ---------------------------------- | -------- | -------- | -------------- | -------------- |
| Authorization                 | 用户登录令牌                       | header   | true     |                |                |
| param                         | param                              | body     | true     | DrugCleanParam | DrugCleanParam |
| &emsp;&emsp;drugComment       | 药品源名称                         |          | false    | string         |                |
| &emsp;&emsp;drugCommentId     | 药品源数据ID                       |          | false    | integer(int32) |                |
| &emsp;&emsp;drugStandardId    | 药品标准名ID                       |          | false    | integer(int32) |                |
| &emsp;&emsp;drugStandardName  | 标准名                             |          | false    | string         |                |
| &emsp;&emsp;pageNum           | 当前页数                           |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize          | 每页条数                           |          | false    | integer(int32) |                |
| &emsp;&emsp;parentCompanyId   | 父级公司ID                         |          | false    | integer(int32) |                |
| &emsp;&emsp;standardCompanyId | 标准公司ID                         |          | false    | integer(int32) |                |
| &emsp;&emsp;status            | 0-暂未匹配，1-已匹配，2-不需要清洗 |          | false    | integer(int32) |                |

**响应状态**:

| 状态码 | 说明         | schema                           |
| ------ | ------------ | -------------------------------- |
| 200    | OK           | Result«BasePageVo«DrugCleanDto»» |
| 201    | Created      |                                  |
| 401    | Unauthorized |                                  |
| 403    | Forbidden    |                                  |
| 404    | Not Found    |                                  |

**响应参数**:

| 参数名称                                                   | 参数说明                               | 类型                     | schema                   |
| ---------------------------------------------------------- | -------------------------------------- | ------------------------ | ------------------------ |
| code                                                       |                                        | integer(int32)           | integer(int32)           |
| data                                                       |                                        | BasePageVo«DrugCleanDto» | BasePageVo«DrugCleanDto» |
| &emsp;&emsp;list                                           |                                        | array                    | DrugCleanDto             |
| &emsp;&emsp;&emsp;&emsp;acceptanceCount                    | 登记号统计次数                         | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;acceptanceNo                       |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyDtoList                     |                                        | array                    | CleanCompanyDto          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;acceptanceNo           |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cleanStatus            | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cnt                    | 统计次数                               | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyOriginName      | 源名称                                 | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyShortName       | 简称                                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名                                 | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyType            | 类型                                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id                     | id                                     | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID                                 | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级简称                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;remark                 | 备注                                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sources                | 来源                                   | array                    | string                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;standardId             | 标准公司ID                             | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime             | 操作时间                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updater                | 操作人                                 | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyName                        | 公司名称(清洗后)                       | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyNameOrigin                  |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyNameParent                  | 母公司名称                             | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;dosageForm                         | 剂型                                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugCode                           | 代号                                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugComment                        | 药品源数据                             | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugCommentId                      | 药品源数据ID                           | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;drugGoodsNameCn                    |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugGoodsNameEn                    |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugNickName                       |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugNormalNameCn                   | 通用名(中文)                           | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugNormalNameEn                   | 通用名(英文)                           | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugSourceStr                      |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugStandardId                     | 药品标准名ID                           | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;drugStandardName                   | 标准名                                 | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugType                           | 药品类型(清洗后)                       | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugTypeOrigin                     |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;otherComment                       | 其他(例如，药物结构描述)               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;refId                              |                                        | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;registerType                       | 药品注册分类(清洗后)                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;registerTypeOrigin                 |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;remark                             |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;sourceRef                          |                                        | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;sourceType                         |                                        | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;status                             | 0-暂未匹配，1-已匹配，2-不需要清洗     | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;updateTime                         | 更新时间                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;updateUser                         | 更新人                                 | string                   |                          |
| &emsp;&emsp;pages                                          |                                        | integer(int32)           |                          |
| &emsp;&emsp;total                                          |                                        | integer(int64)           |                          |
| msg                                                        |                                        | string                   |                          |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"acceptanceCount": 0,
				"acceptanceNo": "",
				"companyDtoList": [
					{
						"acceptanceNo": "",
						"cleanStatus": 0,
						"cnt": 0,
						"companyOriginName": "",
						"companyShortName": "",
						"companyStandardName": "",
						"companyType": "",
						"id": 0,
						"parentCompanyId": 0,
						"parentCompanyShortName": "",
						"remark": "",
						"sources": [],
						"standardId": 0,
						"updateTime": "",
						"updater": ""
					}
				],
				"companyName": "",
				"companyNameOrigin": "",
				"companyNameParent": "",
				"dosageForm": "",
				"drugCode": "",
				"drugComment": "",
				"drugCommentId": 0,
				"drugGoodsNameCn": "",
				"drugGoodsNameEn": "",
				"drugNickName": "",
				"drugNormalNameCn": "",
				"drugNormalNameEn": "",
				"drugSourceStr": "",
				"drugStandardId": 0,
				"drugStandardName": "",
				"drugType": "",
				"drugTypeOrigin": "",
				"otherComment": "",
				"refId": 0,
				"registerType": "",
				"registerTypeOrigin": "",
				"remark": "",
				"sourceRef": "",
				"sourceType": 0,
				"status": 0,
				"updateTime": "",
				"updateUser": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 药品别名列表

**接口地址**:`/lyqAdmin/api/admin/drug/commentDrugPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 剂型列表(源数据)

**接口地址**:`/lyqAdmin/api/admin/drug/dosageFormList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 药品类型(源数据)

**接口地址**:`/lyqAdmin/api/admin/drug/drugTypeList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 登记号名称列表

**接口地址**:`/lyqAdmin/api/admin/drug/getAcceptanceNos`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取药品信息处理统计量

**接口地址**:`/lyqAdmin/api/admin/drug/getStatData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| queryParam            | queryParam   | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema              |
| ------ | ------------ | ------------------- |
| 200    | OK           | Result«StatDataDto» |
| 201    | Created      |                     |
| 401    | Unauthorized |                     |
| 403    | Forbidden    |                     |
| 404    | Not Found    |                     |

**响应参数**:

| 参数名称                   | 参数说明   | 类型           | schema         |
| -------------------------- | ---------- | -------------- | -------------- |
| code                       |            | integer(int32) | integer(int32) |
| data                       |            | StatDataDto    | StatDataDto    |
| &emsp;&emsp;allTotal       | 总量       | integer(int64) |                |
| &emsp;&emsp;completedTotal | 已处理量   | integer(int64) |                |
| &emsp;&emsp;name           | 名称       | string         |                |
| &emsp;&emsp;otherTotal     | 其他数据量 | integer(int64) |                |
| &emsp;&emsp;pendingTotal   | 待处理量   | integer(int64) |                |
| msg                        |            | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"allTotal": 0,
		"completedTotal": 0,
		"name": "",
		"otherTotal": 0,
		"pendingTotal": 0
	},
	"msg": ""
}
```

## 药品标准简称查询

**接口地址**:`/lyqAdmin/api/admin/drug/queryByName`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                           |
| ------ | ------------ | -------------------------------- |
| 200    | OK           | Result«BasePageVo«DrugShortDto»» |
| 201    | Created      |                                  |
| 401    | Unauthorized |                                  |
| 403    | Forbidden    |                                  |
| 404    | Not Found    |                                  |

**响应参数**:

| 参数名称                                 | 参数说明   | 类型                     | schema                   |
| ---------------------------------------- | ---------- | ------------------------ | ------------------------ |
| code                                     |            | integer(int32)           | integer(int32)           |
| data                                     |            | BasePageVo«DrugShortDto» | BasePageVo«DrugShortDto» |
| &emsp;&emsp;list                         |            | array                    | DrugShortDto             |
| &emsp;&emsp;&emsp;&emsp;drugCd           | 代号编码   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugStandardName | 标准名     | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugType         | 类型       | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;standardId       | standardId | integer                  |                          |
| &emsp;&emsp;pages                        |            | integer(int32)           |                          |
| &emsp;&emsp;total                        |            | integer(int64)           |                          |
| msg                                      |            | string                   |                          |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"drugCd": "",
				"drugStandardName": "",
				"drugType": "",
				"standardId": 0
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 关联药品库信息

**接口地址**:`/lyqAdmin/api/admin/drug/saveRelation`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "drugComment": "",
  "drugCommentId": 0,
  "drugStandardId": 0
}
```

**请求参数**:

| 参数名称                   | 参数说明     | 请求类型 | 是否必须 | 数据类型        | schema          |
| -------------------------- | ------------ | -------- | -------- | --------------- | --------------- |
| Authorization              | 用户登录令牌 | header   | true     |                 |                 |
| dto                        | dto          | body     | true     | DrugRelationDto | DrugRelationDto |
| &emsp;&emsp;drugComment    | 药品源数据   |          | false    | string          |                 |
| &emsp;&emsp;drugCommentId  | 药品源数据ID |          | false    | integer(int64)  |                 |
| &emsp;&emsp;drugStandardId | 药品标准名ID |          | false    | integer(int32)  |                 |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 药品标准库列表

**接口地址**:`/lyqAdmin/api/admin/drug/standardPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "drugComment": "",
  "drugStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "standardId": 0
}
```

**请求参数**:

| 参数名称                     | 参数说明     | 请求类型 | 是否必须 | 数据类型          | schema            |
| ---------------------------- | ------------ | -------- | -------- | ----------------- | ----------------- |
| Authorization                | 用户登录令牌 | header   | true     |                   |                   |
| param                        | param        | body     | true     | DrugStandardParam | DrugStandardParam |
| &emsp;&emsp;drugComment      | 药品源名称   |          | false    | string            |                   |
| &emsp;&emsp;drugStandardName | 标准名       |          | false    | string            |                   |
| &emsp;&emsp;pageNum          | 当前页数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize         | 每页条数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;standardId       | 标准ID       |          | false    | integer(int32)    |                   |

**响应状态**:

| 状态码 | 说明         | schema                              |
| ------ | ------------ | ----------------------------------- |
| 200    | OK           | Result«BasePageVo«DrugStandardDto»» |
| 201    | Created      |                                     |
| 401    | Unauthorized |                                     |
| 403    | Forbidden    |                                     |
| 404    | Not Found    |                                     |

**响应参数**:

| 参数名称                                  | 参数说明                         | 类型                        | schema                      |
| ----------------------------------------- | -------------------------------- | --------------------------- | --------------------------- |
| code                                      |                                  | integer(int32)              | integer(int32)              |
| data                                      |                                  | BasePageVo«DrugStandardDto» | BasePageVo«DrugStandardDto» |
| &emsp;&emsp;list                          |                                  | array                       | DrugStandardDto             |
| &emsp;&emsp;&emsp;&emsp;companyName       | 公司名称                         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;developmentCode   | 代号编码                         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;dosageForm        | 剂型                             | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;drugStandardName  | 标准名                           | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;drugType          | 类型                             | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;genericNameCn     | 通用名(中文)                     | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;genericNameEn     | 通用名(英文)                     | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;otherInfo         | 其他信息                         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyName | 父级公司名称                     | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;standardId        | standardId                       | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;statisticCount    | 统计次数                         | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;status            | 状态0-无冲突，1-待确认，2-已确认 | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;updateTime        | 更新时间                         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;updateUser        | 更新人                           | string                      |                             |
| &emsp;&emsp;pages                         |                                  | integer(int32)              |                             |
| &emsp;&emsp;total                         |                                  | integer(int64)              |                             |
| msg                                       |                                  | string                      |                             |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"companyName": "",
				"developmentCode": "",
				"dosageForm": "",
				"drugStandardName": "",
				"drugType": "",
				"genericNameCn": "",
				"genericNameEn": "",
				"otherInfo": "",
				"parentCompanyName": "",
				"standardId": 0,
				"statisticCount": 0,
				"status": 0,
				"updateTime": "",
				"updateUser": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 药品标准信息保存

**接口地址**:`/lyqAdmin/api/admin/drug/standardSave`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanedDrugName": "",
  "createTime": "",
  "createUser": "",
  "developmentCode": "",
  "dosageForm": "",
  "drugType": "",
  "genericNameCn": "",
  "genericNameEn": "",
  "id": 0,
  "isDeleted": 0,
  "otherInfo": "",
  "status": 0,
  "updateTime": "",
  "updateUser": ""
}
```

**请求参数**:

| 参数名称                    | 参数说明         | 请求类型 | 是否必须 | 数据类型          | schema           |
| --------------------------- | ---------------- | -------- | -------- | ----------------- | ---------------- |
| Authorization               | 用户登录令牌     | header   | true     |                   |                  |
| drugStandardInfo            | drugStandardInfo | body     | true     | DrugStandardInfo  | DrugStandardInfo |
| &emsp;&emsp;cleanedDrugName |                  |          | false    | string            |                  |
| &emsp;&emsp;createTime      |                  |          | false    | string(date-time) |                  |
| &emsp;&emsp;createUser      |                  |          | false    | string            |                  |
| &emsp;&emsp;developmentCode |                  |          | false    | string            |                  |
| &emsp;&emsp;dosageForm      |                  |          | false    | string            |                  |
| &emsp;&emsp;drugType        |                  |          | false    | string            |                  |
| &emsp;&emsp;genericNameCn   |                  |          | false    | string            |                  |
| &emsp;&emsp;genericNameEn   |                  |          | false    | string            |                  |
| &emsp;&emsp;id              |                  |          | false    | integer(int32)    |                  |
| &emsp;&emsp;isDeleted       |                  |          | false    | integer(int32)    |                  |
| &emsp;&emsp;otherInfo       |                  |          | false    | string            |                  |
| &emsp;&emsp;status          |                  |          | false    | integer(int32)    |                  |
| &emsp;&emsp;updateTime      |                  |          | false    | string(date-time) |                  |
| &emsp;&emsp;updateUser      |                  |          | false    | string            |                  |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 修改清洗状态

**接口地址**:`/lyqAdmin/api/admin/drug/updateCleanStatus`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "id": 0
}
```

**请求参数**:

| 参数名称                | 参数说明                               | 请求类型 | 是否必须 | 数据类型             | schema               |
| ----------------------- | -------------------------------------- | -------- | -------- | -------------------- | -------------------- |
| Authorization           | 用户登录令牌                           | header   | true     |                      |                      |
| updateCleanStatusDto    | updateCleanStatusDto                   | body     | true     | UpdateCleanStatusDto | UpdateCleanStatusDto |
| &emsp;&emsp;cleanStatus | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)       |                      |
| &emsp;&emsp;id          | id                                     |          | false    | integer(int64)       |                      |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

# 试验分期字典管理

## 获取实验分期基础枚举

**接口地址**:`/lyqAdmin/api/admin/trialStagesMapping/getOptions`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |

**响应状态**:

| 状态码 | 说明         | schema               |
| ------ | ------------ | -------------------- |
| 200    | OK           | Result«List«string»» |
| 401    | Unauthorized |                      |
| 403    | Forbidden    |                      |
| 404    | Not Found    |                      |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | array          |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": [],
	"msg": ""
}
```

## 试验分期列表

**接口地址**:`/lyqAdmin/api/admin/trialStagesMapping/pageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                                    |
| ------ | ------------ | ----------------------------------------- |
| 200    | OK           | Result«BasePageVo«CdeTrialStagesMapping»» |
| 201    | Created      |                                           |
| 401    | Unauthorized |                                           |
| 403    | Forbidden    |                                           |
| 404    | Not Found    |                                           |

**响应参数**:

| 参数名称                                       | 参数说明 | 类型                              | schema                            |
| ---------------------------------------------- | -------- | --------------------------------- | --------------------------------- |
| code                                           |          | integer(int32)                    | integer(int32)                    |
| data                                           |          | BasePageVo«CdeTrialStagesMapping» | BasePageVo«CdeTrialStagesMapping» |
| &emsp;&emsp;list                               |          | array                             | CdeTrialStagesMapping             |
| &emsp;&emsp;&emsp;&emsp;cleanedTrialStages     |          | string                            |                                   |
| &emsp;&emsp;&emsp;&emsp;cleanedTrialStagesList |          | array                             | string                            |
| &emsp;&emsp;&emsp;&emsp;createTime             |          | string                            |                                   |
| &emsp;&emsp;&emsp;&emsp;createUser             |          | string                            |                                   |
| &emsp;&emsp;&emsp;&emsp;id                     |          | integer                           |                                   |
| &emsp;&emsp;&emsp;&emsp;isDeleted              |          | integer                           |                                   |
| &emsp;&emsp;&emsp;&emsp;status                 |          | integer                           |                                   |
| &emsp;&emsp;&emsp;&emsp;trialStages            |          | string                            |                                   |
| &emsp;&emsp;&emsp;&emsp;updateTime             |          | string                            |                                   |
| &emsp;&emsp;&emsp;&emsp;updateUser             |          | string                            |                                   |
| &emsp;&emsp;pages                              |          | integer(int32)                    |                                   |
| &emsp;&emsp;total                              |          | integer(int64)                    |                                   |
| msg                                            |          | string                            |                                   |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"cleanedTrialStages": "",
				"cleanedTrialStagesList": [],
				"createTime": "",
				"createUser": "",
				"id": 0,
				"isDeleted": 0,
				"status": 0,
				"trialStages": "",
				"updateTime": "",
				"updateUser": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 编辑保存

**接口地址**:`/lyqAdmin/api/admin/trialStagesMapping/save`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanedTrialStages": "",
  "cleanedTrialStagesList": [],
  "createTime": "",
  "createUser": "",
  "id": 0,
  "isDeleted": 0,
  "status": 0,
  "trialStages": "",
  "updateTime": "",
  "updateUser": ""
}
```

**请求参数**:

| 参数名称                           | 参数说明     | 请求类型 | 是否必须 | 数据类型              | schema                |
| ---------------------------------- | ------------ | -------- | -------- | --------------------- | --------------------- |
| Authorization                      | 用户登录令牌 | header   | true     |                       |                       |
| info                               | info         | body     | true     | CdeTrialStagesMapping | CdeTrialStagesMapping |
| &emsp;&emsp;cleanedTrialStages     |              |          | false    | string                |                       |
| &emsp;&emsp;cleanedTrialStagesList |              |          | false    | array                 | string                |
| &emsp;&emsp;createTime             |              |          | false    | string(date-time)     |                       |
| &emsp;&emsp;createUser             |              |          | false    | string                |                       |
| &emsp;&emsp;id                     |              |          | false    | integer(int64)        |                       |
| &emsp;&emsp;isDeleted              |              |          | false    | integer(int32)        |                       |
| &emsp;&emsp;status                 |              |          | false    | integer(int32)        |                       |
| &emsp;&emsp;trialStages            |              |          | false    | string                |                       |
| &emsp;&emsp;updateTime             |              |          | false    | string(date-time)     |                       |
| &emsp;&emsp;updateUser             |              |          | false    | string                |                       |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

# 适应症管理

## 适应症-分类列表

**接口地址**:`/lyqAdmin/api/admin/indication/categoryPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                                 |
| ------ | ------------ | -------------------------------------- |
| 200    | OK           | Result«BasePageVo«IndicationCategory»» |
| 201    | Created      |                                        |
| 401    | Unauthorized |                                        |
| 403    | Forbidden    |                                        |
| 404    | Not Found    |                                        |

**响应参数**:

| 参数名称                              | 参数说明 | 类型                           | schema                         |
| ------------------------------------- | -------- | ------------------------------ | ------------------------------ |
| code                                  |          | integer(int32)                 | integer(int32)                 |
| data                                  |          | BasePageVo«IndicationCategory» | BasePageVo«IndicationCategory» |
| &emsp;&emsp;list                      |          | array                          | IndicationCategory             |
| &emsp;&emsp;&emsp;&emsp;categoryLevel |          | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;categoryName  |          | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;createTime    |          | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;createUser    |          | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;id            |          | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;isDeleted     |          | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;updateTime    |          | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;updateUser    |          | string                         |                                |
| &emsp;&emsp;pages                     |          | integer(int32)                 |                                |
| &emsp;&emsp;total                     |          | integer(int64)                 |                                |
| msg                                   |          | string                         |                                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"categoryLevel": 0,
				"categoryName": "",
				"createTime": "",
				"createUser": "",
				"id": 0,
				"isDeleted": 0,
				"updateTime": "",
				"updateUser": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 适应症字典(标准信息)列表

**接口地址**:`/lyqAdmin/api/admin/indication/dictPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "indicationCategoryId": 0,
  "indicationCategoryName": "",
  "indicationStandard": "",
  "pageNum": 0,
  "pageSize": 0
}
```

**请求参数**:

| 参数名称                           | 参数说明       | 请求类型 | 是否必须 | 数据类型            | schema              |
| ---------------------------------- | -------------- | -------- | -------- | ------------------- | ------------------- |
| Authorization                      | 用户登录令牌   | header   | true     |                     |                     |
| param                              | param          | body     | true     | IndicationDictParam | IndicationDictParam |
| &emsp;&emsp;indicationCategoryId   | 适应症归类ID   |          | false    | integer(int64)      |                     |
| &emsp;&emsp;indicationCategoryName | 适应症归类名称 |          | false    | string              |                     |
| &emsp;&emsp;indicationStandard     | 适应症名称     |          | false    | string              |                     |
| &emsp;&emsp;pageNum                | 当前页数       |          | false    | integer(int32)      |                     |
| &emsp;&emsp;pageSize               | 每页条数       |          | false    | integer(int32)      |                     |

**响应状态**:

| 状态码 | 说明         | schema                                |
| ------ | ------------ | ------------------------------------- |
| 200    | OK           | Result«BasePageVo«IndicationDictDto»» |
| 201    | Created      |                                       |
| 401    | Unauthorized |                                       |
| 403    | Forbidden    |                                       |
| 404    | Not Found    |                                       |

**响应参数**:

| 参数名称                                       | 参数说明                | 类型                          | schema                        |
| ---------------------------------------------- | ----------------------- | ----------------------------- | ----------------------------- |
| code                                           |                         | integer(int32)                | integer(int32)                |
| data                                           |                         | BasePageVo«IndicationDictDto» | BasePageVo«IndicationDictDto» |
| &emsp;&emsp;list                               |                         | array                         | IndicationDictDto             |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryId   | 适应症分类ID            | integer                       |                               |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryName | 适应症分类名称          | string                        |                               |
| &emsp;&emsp;&emsp;&emsp;indicationStandard     | 清洗后名称              | string                        |                               |
| &emsp;&emsp;&emsp;&emsp;indicationTagId        | indication_tag_info表ID | integer                       |                               |
| &emsp;&emsp;&emsp;&emsp;statisticCount         | 统计次数                | integer                       |                               |
| &emsp;&emsp;&emsp;&emsp;updateTime             | 修改时间                | string                        |                               |
| &emsp;&emsp;&emsp;&emsp;updateUser             | 修改人                  | string                        |                               |
| &emsp;&emsp;pages                              |                         | integer(int32)                |                               |
| &emsp;&emsp;total                              |                         | integer(int64)                |                               |
| msg                                            |                         | string                        |                               |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"indicationCategoryId": 0,
				"indicationCategoryName": "",
				"indicationStandard": "",
				"indicationTagId": 0,
				"statisticCount": 0,
				"updateTime": "",
				"updateUser": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取关联登记号

**接口地址**:`/lyqAdmin/api/admin/indication/getAcceptanceNos`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                               |
| ------ | ------------ | ------------------------------------ |
| 200    | OK           | Result«BasePageVo«IndicationRelDto»» |
| 201    | Created      |                                      |
| 401    | Unauthorized |                                      |
| 403    | Forbidden    |                                      |
| 404    | Not Found    |                                      |

**响应参数**:

| 参数名称                                  | 参数说明                 | 类型                         | schema                       |
| ----------------------------------------- | ------------------------ | ---------------------------- | ---------------------------- |
| code                                      |                          | integer(int32)               | integer(int32)               |
| data                                      |                          | BasePageVo«IndicationRelDto» | BasePageVo«IndicationRelDto» |
| &emsp;&emsp;list                          |                          | array                        | IndicationRelDto             |
| &emsp;&emsp;&emsp;&emsp;acceptanceNo      | 受理号                   | string                       |                              |
| &emsp;&emsp;&emsp;&emsp;indicationComment | 适应症描述               | string                       |                              |
| &emsp;&emsp;&emsp;&emsp;sourceRef         | 来源：HGR、IND、CDE、NDA | string                       |                              |
| &emsp;&emsp;pages                         |                          | integer(int32)               |                              |
| &emsp;&emsp;total                         |                          | integer(int64)               |                              |
| msg                                       |                          | string                       |                              |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"acceptanceNo": "",
				"indicationComment": "",
				"sourceRef": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 通过适应症（标准信息）查询源数据名称

**接口地址**:`/lyqAdmin/api/admin/indication/getIndicationCommentList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                     |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Result«BasePageVo«string»» |
| 201    | Created      |                            |
| 401    | Unauthorized |                            |
| 403    | Forbidden    |                            |
| 404    | Not Found    |                            |

**响应参数**:

| 参数名称          | 参数说明 | 类型               | schema             |
| ----------------- | -------- | ------------------ | ------------------ |
| code              |          | integer(int32)     | integer(int32)     |
| data              |          | BasePageVo«string» | BasePageVo«string» |
| &emsp;&emsp;list  |          | array              | string             |
| &emsp;&emsp;pages |          | integer(int32)     |                    |
| &emsp;&emsp;total |          | integer(int64)     |                    |
| msg               |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 适应症信息(源数据)详情

**接口地址**:`/lyqAdmin/api/admin/indication/getIndicationDetail`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称            | 参数说明            | 请求类型 | 是否必须 | 数据类型       | schema |
| ------------------- | ------------------- | -------- | -------- | -------------- | ------ |
| Authorization       | 用户登录令牌        | header   | true     |                |        |
| indicationCommentId | indicationCommentId | query    | true     | integer(int64) |        |

**响应状态**:

| 状态码 | 说明         | schema                      |
| ------ | ------------ | --------------------------- |
| 200    | OK           | Result«IndicationDetailDto» |
| 401    | Unauthorized |                             |
| 403    | Forbidden    |                             |
| 404    | Not Found    |                             |

**响应参数**:

| 参数名称                                       | 参数说明                   | 类型                | schema              |
| ---------------------------------------------- | -------------------------- | ------------------- | ------------------- |
| code                                           |                            | integer(int32)      | integer(int32)      |
| data                                           |                            | IndicationDetailDto | IndicationDetailDto |
| &emsp;&emsp;indicationComment                  | 适应症描述(源数据)         | string              |                     |
| &emsp;&emsp;indicationCommentId                | indiction_comment_info表ID | integer(int64)      |                     |
| &emsp;&emsp;indicationTagDtoList               | 适应症(清洗后)             | array               | IndicationTagDto    |
| &emsp;&emsp;&emsp;&emsp;createTime             |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;createUser             |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;id                     |                            | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryId   |                            | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryName |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdName      |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdScope     |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationStandard     |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationTagId        |                            | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;isDeleted              |                            | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;updateTime             |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;updateUser             |                            | string              |                     |
| &emsp;&emsp;sourceList                         | 来源                       | array               | string              |
| &emsp;&emsp;statisticCount                     | 统计次数                   | integer(int32)      |                     |
| &emsp;&emsp;status                             | 状态                       | integer(int32)      |                     |
| &emsp;&emsp;updateTime                         | 更新时间                   | string(date-time)   |                     |
| &emsp;&emsp;updateUser                         |                            | string              |                     |
| msg                                            |                            | string              |                     |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"indicationComment": "",
		"indicationCommentId": 0,
		"indicationTagDtoList": [
			{
				"createTime": "",
				"createUser": "",
				"id": 0,
				"indicationCategoryId": 0,
				"indicationCategoryName": "",
				"indicationIcdName": "",
				"indicationIcdScope": "",
				"indicationStandard": "",
				"indicationTagId": 0,
				"isDeleted": 0,
				"updateTime": "",
				"updateUser": ""
			}
		],
		"sourceList": [],
		"statisticCount": 0,
		"status": 0,
		"updateTime": "",
		"updateUser": ""
	},
	"msg": ""
}
```

## 获取适应症信息处理统计量

**接口地址**:`/lyqAdmin/api/admin/indication/getStatData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| queryParam            | queryParam   | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema              |
| ------ | ------------ | ------------------- |
| 200    | OK           | Result«StatDataDto» |
| 201    | Created      |                     |
| 401    | Unauthorized |                     |
| 403    | Forbidden    |                     |
| 404    | Not Found    |                     |

**响应参数**:

| 参数名称                   | 参数说明   | 类型           | schema         |
| -------------------------- | ---------- | -------------- | -------------- |
| code                       |            | integer(int32) | integer(int32) |
| data                       |            | StatDataDto    | StatDataDto    |
| &emsp;&emsp;allTotal       | 总量       | integer(int64) |                |
| &emsp;&emsp;completedTotal | 已处理量   | integer(int64) |                |
| &emsp;&emsp;name           | 名称       | string         |                |
| &emsp;&emsp;otherTotal     | 其他数据量 | integer(int64) |                |
| &emsp;&emsp;pendingTotal   | 待处理量   | integer(int64) |                |
| msg                        |            | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"allTotal": 0,
		"completedTotal": 0,
		"name": "",
		"otherTotal": 0,
		"pendingTotal": 0
	},
	"msg": ""
}
```

## 适应症信息(源数据)查询

**接口地址**:`/lyqAdmin/api/admin/indication/pageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "indicationComment": "",
  "indicationParentId": 0,
  "indicationTagId": 0,
  "pageNum": 0,
  "pageSize": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                       | 参数说明             | 请求类型 | 是否必须 | 数据类型        | schema          |
| ------------------------------ | -------------------- | -------- | -------- | --------------- | --------------- |
| Authorization                  | 用户登录令牌         | header   | true     |                 |                 |
| param                          | param                | body     | true     | IndicationParam | IndicationParam |
| &emsp;&emsp;indicationComment  | 适应症名称（源数据） |          | false    | string          |                 |
| &emsp;&emsp;indicationParentId | 适应症父ID           |          | false    | integer(int64)  |                 |
| &emsp;&emsp;indicationTagId    | 适应症ID             |          | false    | integer(int64)  |                 |
| &emsp;&emsp;pageNum            | 当前页数             |          | false    | integer(int32)  |                 |
| &emsp;&emsp;pageSize           | 每页条数             |          | false    | integer(int32)  |                 |
| &emsp;&emsp;status             | 状态                 |          | false    | integer(int32)  |                 |

**响应状态**:

| 状态码 | 说明         | schema                            |
| ------ | ------------ | --------------------------------- |
| 200    | OK           | Result«BasePageVo«IndicationDto»» |
| 201    | Created      |                                   |
| 401    | Unauthorized |                                   |
| 403    | Forbidden    |                                   |
| 404    | Not Found    |                                   |

**响应参数**:

| 参数名称                                                   | 参数说明                               | 类型                      | schema                    |
| ---------------------------------------------------------- | -------------------------------------- | ------------------------- | ------------------------- |
| code                                                       |                                        | integer(int32)            | integer(int32)            |
| data                                                       |                                        | BasePageVo«IndicationDto» | BasePageVo«IndicationDto» |
| &emsp;&emsp;list                                           |                                        | array                     | IndicationDto             |
| &emsp;&emsp;&emsp;&emsp;indicationComment                  | 适应症描述(源数据)                     | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;indicationCommentId                | indiction_comment_info表ID             | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;indicationTagDtoList               | 适应症(清洗后)                         | array                     | IndicationTagDto          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime             |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createUser             |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id                     |                                        | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationCategoryId   |                                        | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationCategoryName |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationIcdName      |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationIcdScope     |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationStandard     |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationTagId        |                                        | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;isDeleted              |                                        | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime             |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateUser             |                                        | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;sourceList                         | 来源                                   | array                     | string                    |
| &emsp;&emsp;&emsp;&emsp;statisticCount                     | 统计次数(相关受理号/备案号)            | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;status                             | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;updateTime                         | 更新时间                               | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;updateUser                         | 操作人                                 | string                    |                           |
| &emsp;&emsp;pages                                          |                                        | integer(int32)            |                           |
| &emsp;&emsp;total                                          |                                        | integer(int64)            |                           |
| msg                                                        |                                        | string                    |                           |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"indicationComment": "",
				"indicationCommentId": 0,
				"indicationTagDtoList": [
					{
						"createTime": "",
						"createUser": "",
						"id": 0,
						"indicationCategoryId": 0,
						"indicationCategoryName": "",
						"indicationIcdName": "",
						"indicationIcdScope": "",
						"indicationStandard": "",
						"indicationTagId": 0,
						"isDeleted": 0,
						"updateTime": "",
						"updateUser": ""
					}
				],
				"sourceList": [],
				"statisticCount": 0,
				"status": 0,
				"updateTime": "",
				"updateUser": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 适应症(源信息)信息保存

**接口地址**:`/lyqAdmin/api/admin/indication/saveIndication`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "indicationComment": "",
  "indicationCommentId": 0,
  "indicationTagDtoList": [
    {
      "createTime": "",
      "createUser": "",
      "id": 0,
      "indicationCategoryId": 0,
      "indicationCategoryName": "",
      "indicationIcdName": "",
      "indicationIcdScope": "",
      "indicationStandard": "",
      "indicationTagId": 0,
      "isDeleted": 0,
      "updateTime": "",
      "updateUser": ""
    }
  ],
  "sourceList": [],
  "statisticCount": 0,
  "status": 0,
  "updateTime": "",
  "updateUser": ""
}
```

**请求参数**:

| 参数名称                                       | 参数说明                   | 请求类型 | 是否必须 | 数据类型            | schema              |
| ---------------------------------------------- | -------------------------- | -------- | -------- | ------------------- | ------------------- |
| Authorization                                  | 用户登录令牌               | header   | true     |                     |                     |
| dto                                            | dto                        | body     | true     | IndicationDetailDto | IndicationDetailDto |
| &emsp;&emsp;indicationComment                  | 适应症描述(源数据)         |          | false    | string              |                     |
| &emsp;&emsp;indicationCommentId                | indiction_comment_info表ID |          | false    | integer(int64)      |                     |
| &emsp;&emsp;indicationTagDtoList               | 适应症(清洗后)             |          | false    | array               | IndicationTagDto    |
| &emsp;&emsp;&emsp;&emsp;createTime             |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;createUser             |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;id                     |                            |          | false    | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryId   |                            |          | false    | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryName |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdName      |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdScope     |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationStandard     |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationTagId        |                            |          | false    | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;isDeleted              |                            |          | false    | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;updateTime             |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;updateUser             |                            |          | false    | string              |                     |
| &emsp;&emsp;sourceList                         | 来源                       |          | false    | array               | string              |
| &emsp;&emsp;statisticCount                     | 统计次数                   |          | false    | integer(int32)      |                     |
| &emsp;&emsp;status                             | 状态                       |          | false    | integer(int32)      |                     |
| &emsp;&emsp;updateTime                         | 更新时间                   |          | false    | string(date-time)   |                     |
| &emsp;&emsp;updateUser                         |                            |          | false    | string              |                     |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 适应症字典(标准信息)保存

**接口地址**:`/lyqAdmin/api/admin/indication/saveIndicationDict`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "indicationCategoryId": 0,
  "indicationCategoryName": "",
  "indicationStandard": "",
  "indicationTagId": 0,
  "statisticCount": 0,
  "updateTime": "",
  "updateUser": ""
}
```

**请求参数**:

| 参数名称                           | 参数说明                | 请求类型 | 是否必须 | 数据类型          | schema            |
| ---------------------------------- | ----------------------- | -------- | -------- | ----------------- | ----------------- |
| Authorization                      | 用户登录令牌            | header   | true     |                   |                   |
| dto                                | dto                     | body     | true     | IndicationDictDto | IndicationDictDto |
| &emsp;&emsp;indicationCategoryId   | 适应症分类ID            |          | false    | integer(int64)    |                   |
| &emsp;&emsp;indicationCategoryName | 适应症分类名称          |          | false    | string            |                   |
| &emsp;&emsp;indicationStandard     | 清洗后名称              |          | false    | string            |                   |
| &emsp;&emsp;indicationTagId        | indication_tag_info表ID |          | false    | integer(int64)    |                   |
| &emsp;&emsp;statisticCount         | 统计次数                |          | false    | integer(int32)    |                   |
| &emsp;&emsp;updateTime             | 修改时间                |          | false    | string(date-time) |                   |
| &emsp;&emsp;updateUser             | 修改人                  |          | false    | string            |                   |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```

## 适应症名称(源数据)查询

**接口地址**:`/lyqAdmin/api/admin/indication/shortNameData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "id": 0,
  "pageNum": 0,
  "pageSize": 0,
  "searchKey": ""
}
```

**请求参数**:

| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型       | schema         |
| --------------------- | ------------ | -------- | -------- | -------------- | -------------- |
| Authorization         | 用户登录令牌 | header   | true     |                |                |
| param                 | param        | body     | true     | BaseQueryParam | BaseQueryParam |
| &emsp;&emsp;id        | ID           |          | false    | integer(int64) |                |
| &emsp;&emsp;pageNum   | 当前页数     |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize  | 每页条数     |          | false    | integer(int32) |                |
| &emsp;&emsp;searchKey | 查询字段     |          | false    | string         |                |

**响应状态**:

| 状态码 | 说明         | schema                                 |
| ------ | ------------ | -------------------------------------- |
| 200    | OK           | Result«BasePageVo«IndicationShortDto»» |
| 201    | Created      |                                        |
| 401    | Unauthorized |                                        |
| 403    | Forbidden    |                                        |
| 404    | Not Found    |                                        |

**响应参数**:

| 参数名称                                    | 参数说明                   | 类型                           | schema                         |
| ------------------------------------------- | -------------------------- | ------------------------------ | ------------------------------ |
| code                                        |                            | integer(int32)                 | integer(int32)                 |
| data                                        |                            | BasePageVo«IndicationShortDto» | BasePageVo«IndicationShortDto» |
| &emsp;&emsp;list                            |                            | array                          | IndicationShortDto             |
| &emsp;&emsp;&emsp;&emsp;indicationComment   | 适应症描述(源数据)         | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;indicationCommentId | indiction_comment_info表ID | integer                        |                                |
| &emsp;&emsp;pages                           |                            | integer(int32)                 |                                |
| &emsp;&emsp;total                           |                            | integer(int64)                 |                                |
| msg                                         |                            | string                         |                                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"indicationComment": "",
				"indicationCommentId": 0
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 修改清洗状态

**接口地址**:`/lyqAdmin/api/admin/indication/updateCleanStatus`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cleanStatus": 0,
  "id": 0
}
```

**请求参数**:

| 参数名称                | 参数说明                               | 请求类型 | 是否必须 | 数据类型             | schema               |
| ----------------------- | -------------------------------------- | -------- | -------- | -------------------- | -------------------- |
| Authorization           | 用户登录令牌                           | header   | true     |                      |                      |
| updateCleanStatusDto    | updateCleanStatusDto                   | body     | true     | UpdateCleanStatusDto | UpdateCleanStatusDto |
| &emsp;&emsp;cleanStatus | 清洗状态 0-未清洗，1-已清洗,2-不用清洗 |          | false    | integer(int32)       |                      |
| &emsp;&emsp;id          | id                                     |          | false    | integer(int64)       |                      |

**响应状态**:

| 状态码 | 说明         | schema          |
| ------ | ------------ | --------------- |
| 200    | OK           | Result«boolean» |
| 201    | Created      |                 |
| 401    | Unauthorized |                 |
| 403    | Forbidden    |                 |
| 404    | Not Found    |                 |

**响应参数**:

| 参数名称 | 参数说明 | 类型           | schema         |
| -------- | -------- | -------------- | -------------- |
| code     |          | integer(int32) | integer(int32) |
| data     |          | boolean        |                |
| msg      |          | string         |                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": true,
	"msg": ""
}
```
