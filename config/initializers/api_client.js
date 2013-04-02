var PointGaming = global.PointGaming,
    currentUserApiClient = require('../../lib/pg-chat/api/current_user');
    gameRoomApiClient = require('../../lib/pg-chat/api/game_room');

PointGaming.current_user_api_client = new currentUserApiClient(PointGaming.config.api_url || 'https://dev.pointgaming.com/');
PointGaming.game_room_api_client = new gameRoomApiClient(PointGaming.config.api_url || 'https://dev.pointgaming.com/', PointGaming.config.api_token);
