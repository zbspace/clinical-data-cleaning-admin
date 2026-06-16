# lyq-admin管理端接口文档

**简介**:lyq-admin管理端接口文档

**HOST**:47.103.54.49:19080

**联系人**:

**Version**:1.0

**接口路径**:/v2/api-docs

[TOC]

# cache-controller

## getVal

**接口地址**:`/api/admin/cache/getVal`

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

**接口地址**:`/api/admin/cache/setVal`

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

# 公司信息管理

## 获取关联登记号

**接口地址**:`/api/admin/company/getAcceptanceNos`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                | 参数说明     | 请求类型 | 是否必须 | 数据类型          | schema            |
| ----------------------- | ------------ | -------- | -------- | ----------------- | ----------------- |
| Authorization           | 用户登录令牌 | header   | true     |                   |                   |
| param                   | param        | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;companyName | 名称         |          | false    | string            |                   |
| &emsp;&emsp;pageNum     | 当前页数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize    | 每页条数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;queryId     | id           |          | false    | integer(int64)    |                   |
| &emsp;&emsp;status      | 状态         |          | false    | integer(int32)    |                   |

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

**接口地址**:`/api/admin/company/getOriginCompanies`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                | 参数说明     | 请求类型 | 是否必须 | 数据类型          | schema            |
| ----------------------- | ------------ | -------- | -------- | ----------------- | ----------------- |
| Authorization           | 用户登录令牌 | header   | true     |                   |                   |
| queryParam              | queryParam   | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;companyName | 名称         |          | false    | string            |                   |
| &emsp;&emsp;pageNum     | 当前页数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize    | 每页条数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;queryId     | id           |          | false    | integer(int64)    |                   |
| &emsp;&emsp;status      | 状态         |          | false    | integer(int32)    |                   |

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

**接口地址**:`/api/admin/company/getStandardCompany`

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

| 参数名称                        | 参数说明 | 类型               | schema             |
| ------------------------------- | -------- | ------------------ | ------------------ |
| code                            |          | integer(int32)     | integer(int32)     |
| data                            |          | StandardCompanyDto | StandardCompanyDto |
| &emsp;&emsp;cnt                 | 统计次数 | integer(int32)     |                    |
| &emsp;&emsp;companyShortName    | 简称     | string             |                    |
| &emsp;&emsp;companyStandardName | 标准名   | string             |                    |
| &emsp;&emsp;companyType         | 类型     | string             |                    |
| &emsp;&emsp;id                  | id       | integer(int64)     |                    |
| &emsp;&emsp;parentCompanName    | 父级ID   | integer(int64)     |                    |
| &emsp;&emsp;parentCompanyId     | 父级ID   | integer(int64)     |                    |
| &emsp;&emsp;relation            | 关系     | string             |                    |
| &emsp;&emsp;remark              | 备注     | string             |                    |
| &emsp;&emsp;status              | 状态     | integer(int32)     |                    |
| &emsp;&emsp;updateTime          | 操作时间 | string(date-time)  |                    |
| &emsp;&emsp;updater             | 操作人   | string             |                    |
| msg                             |          | string             |                    |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"cnt": 0,
		"companyShortName": "",
		"companyStandardName": "",
		"companyType": "",
		"id": 0,
		"parentCompanName": 0,
		"parentCompanyId": 0,
		"relation": "",
		"remark": "",
		"status": 0,
		"updateTime": "",
		"updater": ""
	},
	"msg": ""
}
```

## 公司信息查询

**接口地址**:`/api/admin/company/pageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                | 参数说明     | 请求类型 | 是否必须 | 数据类型          | schema            |
| ----------------------- | ------------ | -------- | -------- | ----------------- | ----------------- |
| Authorization           | 用户登录令牌 | header   | true     |                   |                   |
| queryDto                | queryDto     | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;companyName | 名称         |          | false    | string            |                   |
| &emsp;&emsp;pageNum     | 当前页数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize    | 每页条数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;queryId     | id           |          | false    | integer(int64)    |                   |
| &emsp;&emsp;status      | 状态         |          | false    | integer(int32)    |                   |

**响应状态**:

| 状态码 | 说明         | schema                              |
| ------ | ------------ | ----------------------------------- |
| 200    | OK           | Result«BasePageVo«CleanCompanyDto»» |
| 201    | Created      |                                     |
| 401    | Unauthorized |                                     |
| 403    | Forbidden    |                                     |
| 404    | Not Found    |                                     |

**响应参数**:

| 参数名称                                       | 参数说明   | 类型                        | schema                      |
| ---------------------------------------------- | ---------- | --------------------------- | --------------------------- |
| code                                           |            | integer(int32)              | integer(int32)              |
| data                                           |            | BasePageVo«CleanCompanyDto» | BasePageVo«CleanCompanyDto» |
| &emsp;&emsp;list                               |            | array                       | CleanCompanyDto             |
| &emsp;&emsp;&emsp;&emsp;acceptanceNo           |            | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;cnt                    | 统计次数   | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;companyOriginName      | 源名称     | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyShortName       | 简称       | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名     | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;companyType            | 类型       | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;id                     | id         | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID     | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级简称   | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;remark                 | 备注       | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;sources                | 来源       | array                       | string                      |
| &emsp;&emsp;&emsp;&emsp;standardId             | 标准公司ID | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;status                 | 状态       | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;updateTime             | 操作时间   | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;updater                | 操作人     | string                      |                             |
| &emsp;&emsp;pages                              |            | integer(int32)              |                             |
| &emsp;&emsp;total                              |            | integer(int64)              |                             |
| msg                                            |            | string                      |                             |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"acceptanceNo": "",
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
				"status": 0,
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

## 公司标准信息获取

**接口地址**:`/api/admin/company/queryByName`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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
| &emsp;&emsp;&emsp;&emsp;id                     | id           | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID       | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级公司简称 | string                      |                             |
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
				"id": 0,
				"parentCompanyId": 0,
				"parentCompanyShortName": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 获取公司字典(标准名)列表

**接口地址**:`/api/admin/company/queryStandardList`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyName": "",
  "pageNum": 0,
  "pageSize": 0,
  "queryId": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                | 参数说明     | 请求类型 | 是否必须 | 数据类型          | schema            |
| ----------------------- | ------------ | -------- | -------- | ----------------- | ----------------- |
| Authorization           | 用户登录令牌 | header   | true     |                   |                   |
| queryParam              | queryParam   | body     | true     | CompanyQueryParam | CompanyQueryParam |
| &emsp;&emsp;companyName | 名称         |          | false    | string            |                   |
| &emsp;&emsp;pageNum     | 当前页数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize    | 每页条数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;queryId     | id           |          | false    | integer(int64)    |                   |
| &emsp;&emsp;status      | 状态         |          | false    | integer(int32)    |                   |

**响应状态**:

| 状态码 | 说明         | schema                                 |
| ------ | ------------ | -------------------------------------- |
| 200    | OK           | Result«BasePageVo«StandardCompanyDto»» |
| 201    | Created      |                                        |
| 401    | Unauthorized |                                        |
| 403    | Forbidden    |                                        |
| 404    | Not Found    |                                        |

**响应参数**:

| 参数名称                                    | 参数说明 | 类型                           | schema                         |
| ------------------------------------------- | -------- | ------------------------------ | ------------------------------ |
| code                                        |          | integer(int32)                 | integer(int32)                 |
| data                                        |          | BasePageVo«StandardCompanyDto» | BasePageVo«StandardCompanyDto» |
| &emsp;&emsp;list                            |          | array                          | StandardCompanyDto             |
| &emsp;&emsp;&emsp;&emsp;cnt                 | 统计次数 | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;companyShortName    | 简称     | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;companyStandardName | 标准名   | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;companyType         | 类型     | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;id                  | id       | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;parentCompanName    | 父级ID   | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId     | 父级ID   | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;relation            | 关系     | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;remark              | 备注     | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;status              | 状态     | integer                        |                                |
| &emsp;&emsp;&emsp;&emsp;updateTime          | 操作时间 | string                         |                                |
| &emsp;&emsp;&emsp;&emsp;updater             | 操作人   | string                         |                                |
| &emsp;&emsp;pages                           |          | integer(int32)                 |                                |
| &emsp;&emsp;total                           |          | integer(int64)                 |                                |
| msg                                         |          | string                         |                                |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"cnt": 0,
				"companyShortName": "",
				"companyStandardName": "",
				"companyType": "",
				"id": 0,
				"parentCompanName": 0,
				"parentCompanyId": 0,
				"relation": "",
				"remark": "",
				"status": 0,
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

## 公司信息手动清洗

**接口地址**:`/api/admin/company/saveClean`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "acceptanceNo": "",
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
  "status": 0,
  "updateTime": "",
  "updater": ""
}
```

**请求参数**:

| 参数名称                           | 参数说明     | 请求类型 | 是否必须 | 数据类型          | schema          |
| ---------------------------------- | ------------ | -------- | -------- | ----------------- | --------------- |
| Authorization                      | 用户登录令牌 | header   | true     |                   |                 |
| dto                                | dto          | body     | true     | CleanCompanyDto   | CleanCompanyDto |
| &emsp;&emsp;acceptanceNo           |              |          | false    | string            |                 |
| &emsp;&emsp;cnt                    | 统计次数     |          | false    | integer(int32)    |                 |
| &emsp;&emsp;companyOriginName      | 源名称       |          | false    | string            |                 |
| &emsp;&emsp;companyShortName       | 简称         |          | false    | string            |                 |
| &emsp;&emsp;companyStandardName    | 标准名       |          | false    | string            |                 |
| &emsp;&emsp;companyType            | 类型         |          | false    | string            |                 |
| &emsp;&emsp;id                     | id           |          | false    | integer(int64)    |                 |
| &emsp;&emsp;parentCompanyId        | 父级ID       |          | false    | integer(int64)    |                 |
| &emsp;&emsp;parentCompanyShortName | 父级简称     |          | false    | string            |                 |
| &emsp;&emsp;remark                 | 备注         |          | false    | string            |                 |
| &emsp;&emsp;sources                | 来源         |          | false    | array             | string          |
| &emsp;&emsp;standardId             | 标准公司ID   |          | false    | integer(int64)    |                 |
| &emsp;&emsp;status                 | 状态         |          | false    | integer(int32)    |                 |
| &emsp;&emsp;updateTime             | 操作时间     |          | false    | string(date-time) |                 |
| &emsp;&emsp;updater                | 操作人       |          | false    | string            |                 |

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

**接口地址**:`/api/admin/company/saveStandardCompany`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "cnt": 0,
  "companyShortName": "",
  "companyStandardName": "",
  "companyType": "",
  "id": 0,
  "parentCompanName": 0,
  "parentCompanyId": 0,
  "relation": "",
  "remark": "",
  "status": 0,
  "updateTime": "",
  "updater": ""
}
```

**请求参数**:

| 参数名称                        | 参数说明     | 请求类型 | 是否必须 | 数据类型           | schema             |
| ------------------------------- | ------------ | -------- | -------- | ------------------ | ------------------ |
| Authorization                   | 用户登录令牌 | header   | true     |                    |                    |
| dto                             | dto          | body     | true     | StandardCompanyDto | StandardCompanyDto |
| &emsp;&emsp;cnt                 | 统计次数     |          | false    | integer(int32)     |                    |
| &emsp;&emsp;companyShortName    | 简称         |          | false    | string             |                    |
| &emsp;&emsp;companyStandardName | 标准名       |          | false    | string             |                    |
| &emsp;&emsp;companyType         | 类型         |          | false    | string             |                    |
| &emsp;&emsp;id                  | id           |          | false    | integer(int64)     |                    |
| &emsp;&emsp;parentCompanName    | 父级ID       |          | false    | integer(int64)     |                    |
| &emsp;&emsp;parentCompanyId     | 父级ID       |          | false    | integer(int64)     |                    |
| &emsp;&emsp;relation            | 关系         |          | false    | string             |                    |
| &emsp;&emsp;remark              | 备注         |          | false    | string             |                    |
| &emsp;&emsp;status              | 状态         |          | false    | integer(int32)     |                    |
| &emsp;&emsp;updateTime          | 操作时间     |          | false    | string(date-time)  |                    |
| &emsp;&emsp;updater             | 操作人       |          | false    | string             |                    |

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

**接口地址**:`/api/adminUser/info`

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
		"userId": 0,
		"username": ""
	},
	"msg": ""
}
```

# 登录管理

## 获取验证码

**接口地址**:`/api/adminLogin/captcha`

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

**接口地址**:`/api/adminLogin/login`

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

**接口地址**:`/api/adminLogin/logout`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称      | 参数说明     | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------- | ------------ | -------- | -------- | -------- | ------ |
| Authorization | 用户登录令牌 | header   | true     |          |        |
| name          |              | query    | false    | string   |        |

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

## 刷新token

**接口地址**:`/api/adminLogin/refreshToken`

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

## 登记号列表

**接口地址**:`/api/admin/drug/acceptanceNoList`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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

## 药品清洗列表

**接口地址**:`/api/admin/drug/cleanPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyId": 0,
  "drugComment": "",
  "drugCommentId": 0,
  "drugStandardId": 0,
  "drugStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "parentCompanyId": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                     | 参数说明                           | 请求类型 | 是否必须 | 数据类型       | schema         |
| ---------------------------- | ---------------------------------- | -------- | -------- | -------------- | -------------- |
| Authorization                | 用户登录令牌                       | header   | true     |                |                |
| param                        | param                              | body     | true     | DrugCleanParam | DrugCleanParam |
| &emsp;&emsp;companyId        | 公司ID                             |          | false    | integer(int32) |                |
| &emsp;&emsp;drugComment      | 药品源名称                         |          | false    | string         |                |
| &emsp;&emsp;drugCommentId    | 药品源数据ID                       |          | false    | integer(int32) |                |
| &emsp;&emsp;drugStandardId   | 药品标准名ID                       |          | false    | integer(int32) |                |
| &emsp;&emsp;drugStandardName | 标准名                             |          | false    | string         |                |
| &emsp;&emsp;pageNum          | 当前页数                           |          | false    | integer(int32) |                |
| &emsp;&emsp;pageSize         | 每页条数                           |          | false    | integer(int32) |                |
| &emsp;&emsp;parentCompanyId  | 父级公司ID                         |          | false    | integer(int32) |                |
| &emsp;&emsp;status           | 0-暂未匹配，1-已匹配，2-不需要清洗 |          | false    | integer(int32) |                |

**响应状态**:

| 状态码 | 说明         | schema                           |
| ------ | ------------ | -------------------------------- |
| 200    | OK           | Result«BasePageVo«DrugCleanDto»» |
| 201    | Created      |                                  |
| 401    | Unauthorized |                                  |
| 403    | Forbidden    |                                  |
| 404    | Not Found    |                                  |

**响应参数**:

| 参数名称                                                   | 参数说明                           | 类型                     | schema                   |
| ---------------------------------------------------------- | ---------------------------------- | ------------------------ | ------------------------ |
| code                                                       |                                    | integer(int32)           | integer(int32)           |
| data                                                       |                                    | BasePageVo«DrugCleanDto» | BasePageVo«DrugCleanDto» |
| &emsp;&emsp;list                                           |                                    | array                    | DrugCleanDto             |
| &emsp;&emsp;&emsp;&emsp;acceptanceCount                    | 登记号统计次数                     | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;acceptanceNo                       |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyDtoList                     |                                    | array                    | CleanCompanyDto          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;acceptanceNo           |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cnt                    | 统计次数                           | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyOriginName      | 源名称                             | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyShortName       | 简称                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名                             | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;companyType            | 类型                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id                     | id                                 | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID                             | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级简称                           | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;remark                 | 备注                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sources                | 来源                               | array                    | string                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;standardId             | 标准公司ID                         | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status                 | 状态                               | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime             | 操作时间                           | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updater                | 操作人                             | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyName                        | 公司名称(清洗后)                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyNameOrigin                  |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;companyNameParent                  | 母公司名称                         | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;dosageForm                         | 剂型                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugCode                           | 代号                               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugComment                        | 药品源数据                         | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugCommentId                      | 药品源数据ID                       | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;drugGoodsNameCn                    |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugGoodsNameEn                    |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugNickName                       |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugNormalNameCn                   | 通用名(中文)                       | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugNormalNameEn                   | 通用名(英文)                       | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugSourceStr                      |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugStandardId                     | 药品标准名ID                       | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;drugStandardName                   | 标准名                             | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugType                           | 药品类型(清洗后)                   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugTypeOrigin                     |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;otherComment                       | 其他(例如，药物结构描述)           | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;refId                              |                                    | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;registerType                       | 药品注册分类(清洗后)               | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;registerTypeOrigin                 |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;remark                             |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;sourceRef                          |                                    | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;sourceType                         |                                    | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;status                             | 0-暂未匹配，1-已匹配，2-不需要清洗 | integer                  |                          |
| &emsp;&emsp;&emsp;&emsp;updateTime                         | 更新时间                           | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;updateUser                         | 更新人                             | string                   |                          |
| &emsp;&emsp;pages                                          |                                    | integer(int32)           |                          |
| &emsp;&emsp;total                                          |                                    | integer(int64)           |                          |
| msg                                                        |                                    | string                   |                          |

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
						"status": 0,
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

**接口地址**:`/api/admin/drug/commentDrugPageData`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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

## 药品名称查询

**接口地址**:`/api/admin/drug/queryByName`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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

| 参数名称                                 | 参数说明 | 类型                     | schema                   |
| ---------------------------------------- | -------- | ------------------------ | ------------------------ |
| code                                     |          | integer(int32)           | integer(int32)           |
| data                                     |          | BasePageVo«DrugShortDto» | BasePageVo«DrugShortDto» |
| &emsp;&emsp;list                         |          | array                    | DrugShortDto             |
| &emsp;&emsp;&emsp;&emsp;drugCd           | 代号编码 | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugStandardName | 标准名   | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;drugType         | 类型     | string                   |                          |
| &emsp;&emsp;&emsp;&emsp;id               | id       | integer                  |                          |
| &emsp;&emsp;pages                        |          | integer(int32)           |                          |
| &emsp;&emsp;total                        |          | integer(int64)           |                          |
| msg                                      |          | string                   |                          |

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
				"id": 0
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 关联药品库信息

**接口地址**:`/api/admin/drug/saveRelation`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "acceptanceCount": 0,
  "acceptanceNo": "",
  "companyDtoList": [
    {
      "acceptanceNo": "",
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
      "status": 0,
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
```

**请求参数**:

| 参数名称                                       | 参数说明                           | 请求类型 | 是否必须 | 数据类型          | schema          |
| ---------------------------------------------- | ---------------------------------- | -------- | -------- | ----------------- | --------------- |
| Authorization                                  | 用户登录令牌                       | header   | true     |                   |                 |
| dto                                            | dto                                | body     | true     | DrugCleanDto      | DrugCleanDto    |
| &emsp;&emsp;acceptanceCount                    | 登记号统计次数                     |          | false    | integer(int32)    |                 |
| &emsp;&emsp;acceptanceNo                       |                                    |          | false    | string            |                 |
| &emsp;&emsp;companyDtoList                     |                                    |          | false    | array             | CleanCompanyDto |
| &emsp;&emsp;&emsp;&emsp;acceptanceNo           |                                    |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;cnt                    | 统计次数                           |          | false    | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;companyOriginName      | 源名称                             |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;companyShortName       | 简称                               |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;companyStandardName    | 标准名                             |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;companyType            | 类型                               |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;id                     | id                                 |          | false    | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;parentCompanyId        | 父级ID                             |          | false    | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;parentCompanyShortName | 父级简称                           |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;remark                 | 备注                               |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;sources                | 来源                               |          | false    | array             | string          |
| &emsp;&emsp;&emsp;&emsp;standardId             | 标准公司ID                         |          | false    | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;status                 | 状态                               |          | false    | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;updateTime             | 操作时间                           |          | false    | string            |                 |
| &emsp;&emsp;&emsp;&emsp;updater                | 操作人                             |          | false    | string            |                 |
| &emsp;&emsp;companyName                        | 公司名称(清洗后)                   |          | false    | string            |                 |
| &emsp;&emsp;companyNameOrigin                  |                                    |          | false    | string            |                 |
| &emsp;&emsp;companyNameParent                  | 母公司名称                         |          | false    | string            |                 |
| &emsp;&emsp;dosageForm                         | 剂型                               |          | false    | string            |                 |
| &emsp;&emsp;drugCode                           | 代号                               |          | false    | string            |                 |
| &emsp;&emsp;drugComment                        | 药品源数据                         |          | false    | string            |                 |
| &emsp;&emsp;drugCommentId                      | 药品源数据ID                       |          | false    | integer(int64)    |                 |
| &emsp;&emsp;drugGoodsNameCn                    |                                    |          | false    | string            |                 |
| &emsp;&emsp;drugGoodsNameEn                    |                                    |          | false    | string            |                 |
| &emsp;&emsp;drugNickName                       |                                    |          | false    | string            |                 |
| &emsp;&emsp;drugNormalNameCn                   | 通用名(中文)                       |          | false    | string            |                 |
| &emsp;&emsp;drugNormalNameEn                   | 通用名(英文)                       |          | false    | string            |                 |
| &emsp;&emsp;drugSourceStr                      |                                    |          | false    | string            |                 |
| &emsp;&emsp;drugStandardId                     | 药品标准名ID                       |          | false    | integer(int32)    |                 |
| &emsp;&emsp;drugStandardName                   | 标准名                             |          | false    | string            |                 |
| &emsp;&emsp;drugType                           | 药品类型(清洗后)                   |          | false    | string            |                 |
| &emsp;&emsp;drugTypeOrigin                     |                                    |          | false    | string            |                 |
| &emsp;&emsp;otherComment                       | 其他(例如，药物结构描述)           |          | false    | string            |                 |
| &emsp;&emsp;refId                              |                                    |          | false    | integer(int64)    |                 |
| &emsp;&emsp;registerType                       | 药品注册分类(清洗后)               |          | false    | string            |                 |
| &emsp;&emsp;registerTypeOrigin                 |                                    |          | false    | string            |                 |
| &emsp;&emsp;remark                             |                                    |          | false    | string            |                 |
| &emsp;&emsp;sourceRef                          |                                    |          | false    | string            |                 |
| &emsp;&emsp;sourceType                         |                                    |          | false    | integer(int32)    |                 |
| &emsp;&emsp;status                             | 0-暂未匹配，1-已匹配，2-不需要清洗 |          | false    | integer(int32)    |                 |
| &emsp;&emsp;updateTime                         | 更新时间                           |          | false    | string(date-time) |                 |
| &emsp;&emsp;updateUser                         | 更新人                             |          | false    | string            |                 |

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

**接口地址**:`/api/admin/drug/standardPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "companyId": 0,
  "drugComment": "",
  "drugStandardName": "",
  "pageNum": 0,
  "pageSize": 0,
  "parentCompanyId": 0
}
```

**请求参数**:

| 参数名称                     | 参数说明     | 请求类型 | 是否必须 | 数据类型          | schema            |
| ---------------------------- | ------------ | -------- | -------- | ----------------- | ----------------- |
| Authorization                | 用户登录令牌 | header   | true     |                   |                   |
| param                        | param        | body     | true     | DrugStandardParam | DrugStandardParam |
| &emsp;&emsp;companyId        | 公司ID       |          | false    | integer(int32)    |                   |
| &emsp;&emsp;drugComment      | 药品源名称   |          | false    | string            |                   |
| &emsp;&emsp;drugStandardName | 标准名       |          | false    | string            |                   |
| &emsp;&emsp;pageNum          | 当前页数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;pageSize         | 每页条数     |          | false    | integer(int32)    |                   |
| &emsp;&emsp;parentCompanyId  | 父级公司ID   |          | false    | integer(int32)    |                   |

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
| &emsp;&emsp;&emsp;&emsp;id                | id                               | integer                     |                             |
| &emsp;&emsp;&emsp;&emsp;otherInfo         | 其他信息                         | string                      |                             |
| &emsp;&emsp;&emsp;&emsp;parentCompanyName | 父级公司名称                     | string                      |                             |
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
				"id": 0,
				"otherInfo": "",
				"parentCompanyName": "",
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

**接口地址**:`/api/admin/drug/standardSave`

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

# 试验分期字典管理

## 试验分期列表

**接口地址**:`/api/admin/trialStagesMapping/pageData`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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

**接口地址**:`/api/admin/trialStagesMapping/save`

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

**接口地址**:`/api/admin/indication/categoryPageData`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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

## 适应症字典列表

**接口地址**:`/api/admin/indication/dictPageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "indicationCategoryId": "",
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
| &emsp;&emsp;indicationCategoryId   | 适应症归类     |          | false    | string              |                     |
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

## 适应症字典-源数据

**接口地址**:`/api/admin/indication/getIndicationCommentList`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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

## 适应症信息详情

**接口地址**:`/api/admin/indication/getIndicationDetail`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

| 参数名称            | 参数说明            | 请求类型 | 是否必须 | 数据类型 | schema |
| ------------------- | ------------------- | -------- | -------- | -------- | ------ |
| Authorization       | 用户登录令牌        | header   | true     |          |        |
| indicationCommentId | indicationCommentId | body     | true     | integer  |        |

**响应状态**:

| 状态码 | 说明         | schema                      |
| ------ | ------------ | --------------------------- |
| 200    | OK           | Result«IndicationDetailDto» |
| 201    | Created      |                             |
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
| &emsp;&emsp;indicationTagDtoList               |                            | array               | IndicationTagDto    |
| &emsp;&emsp;&emsp;&emsp;createTime             |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;createUser             |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;id                     |                            | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryId   |                            | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryName |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdName      |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdScope     |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationStandard     |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;isDeleted              |                            | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;updateTime             |                            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;updateUser             |                            | string              |                     |
| &emsp;&emsp;sourceList                         | 来源                       | array               | string              |
| &emsp;&emsp;statisticCount                     | 统计次数                   | integer(int32)      |                     |
| &emsp;&emsp;status                             | 状态                       | integer(int32)      |                     |
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
				"isDeleted": 0,
				"updateTime": "",
				"updateUser": ""
			}
		],
		"sourceList": [],
		"statisticCount": 0,
		"status": 0,
		"updateUser": ""
	},
	"msg": ""
}
```

## 适应症信息查询

**接口地址**:`/api/admin/indication/pageData`

**请求方式**:`POST`

**请求数据类型**:`application/json`

**响应数据类型**:`*/*`

**接口描述**:

**请求示例**:

```javascript
{
  "indicationParentId": 0,
  "indicationTagId": 0,
  "pageNum": 0,
  "pageSize": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                       | 参数说明     | 请求类型 | 是否必须 | 数据类型        | schema          |
| ------------------------------ | ------------ | -------- | -------- | --------------- | --------------- |
| Authorization                  | 用户登录令牌 | header   | true     |                 |                 |
| param                          | param        | body     | true     | IndicationParam | IndicationParam |
| &emsp;&emsp;indicationParentId | 适应症父ID   |          | false    | integer(int64)  |                 |
| &emsp;&emsp;indicationTagId    | 适应症ID     |          | false    | integer(int64)  |                 |
| &emsp;&emsp;pageNum            | 当前页数     |          | false    | integer(int32)  |                 |
| &emsp;&emsp;pageSize           | 每页条数     |          | false    | integer(int32)  |                 |
| &emsp;&emsp;status             | 状态         |          | false    | integer(int32)  |                 |

**响应状态**:

| 状态码 | 说明         | schema                            |
| ------ | ------------ | --------------------------------- |
| 200    | OK           | Result«BasePageVo«IndicationDto»» |
| 201    | Created      |                                   |
| 401    | Unauthorized |                                   |
| 403    | Forbidden    |                                   |
| 404    | Not Found    |                                   |

**响应参数**:

| 参数名称                                                   | 参数说明                   | 类型                      | schema                    |
| ---------------------------------------------------------- | -------------------------- | ------------------------- | ------------------------- |
| code                                                       |                            | integer(int32)            | integer(int32)            |
| data                                                       |                            | BasePageVo«IndicationDto» | BasePageVo«IndicationDto» |
| &emsp;&emsp;list                                           |                            | array                     | IndicationDto             |
| &emsp;&emsp;&emsp;&emsp;indicationComment                  | 适应症描述(源数据)         | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;indicationCommentId                | indiction_comment_info表ID | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;indicationTagList                  |                            | array                     | IndicationTagInfo         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime             |                            | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createUser             |                            | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id                     |                            | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationCategoryId   |                            | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationCategoryName |                            | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;indicationStandard     |                            | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;isDeleted              |                            | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime             |                            | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateUser             |                            | string                    |                           |
| &emsp;&emsp;&emsp;&emsp;sourceList                         | 来源                       | array                     | string                    |
| &emsp;&emsp;&emsp;&emsp;statisticCount                     | 统计次数                   | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;status                             | 状态                       | integer                   |                           |
| &emsp;&emsp;&emsp;&emsp;updateUser                         |                            | string                    |                           |
| &emsp;&emsp;pages                                          |                            | integer(int32)            |                           |
| &emsp;&emsp;total                                          |                            | integer(int64)            |                           |
| msg                                                        |                            | string                    |                           |

**响应示例**:

```javascript
{
	"code": 0,
	"data": {
		"list": [
			{
				"indicationComment": "",
				"indicationCommentId": 0,
				"indicationTagList": [
					{
						"createTime": "",
						"createUser": "",
						"id": 0,
						"indicationCategoryId": 0,
						"indicationCategoryName": "",
						"indicationStandard": "",
						"isDeleted": 0,
						"updateTime": "",
						"updateUser": ""
					}
				],
				"sourceList": [],
				"statisticCount": 0,
				"status": 0,
				"updateUser": ""
			}
		],
		"pages": 0,
		"total": 0
	},
	"msg": ""
}
```

## 适应症信息保存

**接口地址**:`/api/admin/indication/saveIndication`

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
      "isDeleted": 0,
      "updateTime": "",
      "updateUser": ""
    }
  ],
  "sourceList": [],
  "statisticCount": 0,
  "status": 0,
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
| &emsp;&emsp;indicationTagDtoList               |                            |          | false    | array               | IndicationTagDto    |
| &emsp;&emsp;&emsp;&emsp;createTime             |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;createUser             |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;id                     |                            |          | false    | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryId   |                            |          | false    | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;indicationCategoryName |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdName      |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationIcdScope     |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;indicationStandard     |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;isDeleted              |                            |          | false    | integer             |                     |
| &emsp;&emsp;&emsp;&emsp;updateTime             |                            |          | false    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;updateUser             |                            |          | false    | string              |                     |
| &emsp;&emsp;sourceList                         | 来源                       |          | false    | array               | string              |
| &emsp;&emsp;statisticCount                     | 统计次数                   |          | false    | integer(int32)      |                     |
| &emsp;&emsp;status                             | 状态                       |          | false    | integer(int32)      |                     |
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

## 适应症名称查询

**接口地址**:`/api/admin/indication/shortNameData`

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
| &emsp;&emsp;id        | ID           |          | false    | integer(int32) |                |
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
