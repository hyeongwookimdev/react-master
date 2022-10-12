import { atom, selector } from "recoil";

// 기본값을 정해줄 수 있지만, state 처럼 함수로(만) 값을 변경할 수 있구나.
export const minuteState = atom({
  key: "minutes",
  default: 0,
});

// selector의 리턴 값이 곧 selector의 값이구나
export const hourSelector = selector<number>({
  key: "hours",
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) * 60;
    set(minuteState, minutes);
  },
});

// selector는 atom의 값을 get해서 원하는대로 활용할 수 있는 것.
// selector는 여러개의 atom을 가져와서 다양하게 활용할 수 있다.
// 즉, 컴포넌트에서 여러 아톰을 불러오고, 아톰마다 함수를 실행하고 그럴 필요없이
// 셀렉터에 전부 코딩을 해두면 컴포넌트 상에서는 깔끔한 코딩을 할 수 있다.
