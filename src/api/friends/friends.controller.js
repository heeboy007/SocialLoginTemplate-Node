// friends.controller.js
// 친구를 다루는 데 필요한 함수를 모아놓은 파일

// 현재 함수 목록
// saveDecoInfo :  API 'avatar/decoration' 호출 시, 클라이언트에서 꾸민 아바타 정보를 db에 저장

import { User } from '../../database/index.js';
import wrapWithErrorHandler from '../../util/errorHandler.js';


