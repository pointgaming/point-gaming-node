var PointGaming = global.PointGaming,
    apiClient = require('../../lib/pg-chat/api/client');

PointGaming.api_client = new apiClient(PointGaming.config.api_url || 'https://dev.pointgaming.com/');
