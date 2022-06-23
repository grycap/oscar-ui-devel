module.exports = {
    "provider_url": "https://aai-dev.egi.eu/auth/realms/egi/protocol/",
    "client_id": "417e2915-5e6f-4f50-b4e8-59ffd938957d",
    "redirect_uri" : `${location.origin}/callback.html`,
    "url_authorize": "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/auth",
    "url_user_info": "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/userinfo",
    "token_endpoint": "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/token",
    "api" : "", // value of the api,
    "deploy_container": "false",
}
