// 1. styled-component 임포트
import "styled-components";

// 2. styled-components의 테마 정의를 확장하는 것
declare module "styled-components" {
  export interface DefaultTheme {}
}
