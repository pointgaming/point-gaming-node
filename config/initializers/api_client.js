var PointGaming = global.PointGaming,
    currentUserApiClient = require('../../lib/pg-chat/api/current_user');
    streamApiClient = require('../../lib/pg-chat/api/stream'),
    disputeApiClient = require('../../lib/pg-chat/api/dispute'),
    userApiClient = require('../../lib/pg-chat/api/user');

PointGaming.current_user_api_client = new currentUserApiClient(PointGaming.config.api_url || 'https://dev.pointgaming.com/');
PointGaming.stream_api_client = new streamApiClient(PointGaming.config.api_url || 'https://dev.pointgaming.com/', PointGaming.config.api_token);
PointGaming.dispute_api_client = new disputeApiClient(PointGaming.config.api_url || 'https://dev.pointgaming.com/', PointGaming.config.api_token);
PointGaming.user_api_client = new userApiClient(PointGaming.config.api_url || 'https://dev.pointgaming.com/', PointGaming.config.api_token);
