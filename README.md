# IP-Query-FrontEnd
该项目是一个简单的前端界面，基于`IP-Query-BackEnd`后端`api`自建的ip查询单页面应用
# IP-Query-BackEnd
ip查询api后端部署参考：
[https://linux.do/t/topic/232947](https://linux.do/t/topic/232947)
# 使用serve00 php代理（可选）
## 之所以使用php代理，是因为抱脸部署的api地址国内部分区域无法访问，可能会导致请求失败。
代码：
```
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

function getIPAddress() {
    if(!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];  
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {  
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];  
    }
    else{
        $ip = $_SERVER['REMOTE_ADDR'];  
    }
    return $ip;  
}

function isValidIP($ip) {
    return filter_var($ip, FILTER_VALIDATE_IP) !== false;
}

function getIPInfo($ip) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://替换IP-Query-BackEnd地址,xxx.hf.space/".$ip);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

$ip = '';
if (isset($_GET['ip'])) {
    $ip = $_GET['ip'];
} else {
    $ip = getIPAddress();
}

if (isValidIP($ip)) {
    $ipInfo = getIPInfo($ip);
    echo $ipInfo;
} else {
    $errorip = getIPAddress();
    $erroripInfo = getIPInfo($errorip);
    echo $erroripInfo;
}
?>
```
# 修改IP-Query-FrontEnd代理地址：
vercel部署需要配置环境变量`NEXT_PUBLIC_IPQUERYURL`，详情参考vercel部署
# vercel部署
- 首先fork该项目，按上述内容部署好IP查询api，并修改`app/page.tsx`内的api地址为你部署的api地址
- 访问[vercel官网](https://vercel.com/)选择Github注册或登陆
- 在vercel内的管理面板导入该项目，需要配置环境变量`NEXT_PUBLIC_IPQUERYURL`，`NEXT_PUBLIC_IPQUERYURL`值说明：如果你是抱脸部署，不使用php反代，则直接填写`https://xxx.hf.space/`注意末尾带`/`，如果是使用php代理，则填写`https://your-domain/your-php-file-name.php?ip=`，然后即可点击部署，部署完成后到setting内环境变量检查`NEXT_PUBLIC_IPQUERYURL`是否添加成功，如果没有添加可以手动添加完成后再redeploy
- 等待部署完成，绑定自己的域名即可enjoy
### 本项目部分代码使用ai生成，IP查询后端由其它开源项目提供，该项目仅供学习测试或参考，请勿用于正式生产环境部署！
