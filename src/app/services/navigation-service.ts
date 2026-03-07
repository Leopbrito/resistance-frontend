
let navigator: any;

export const setNavigator = (nav: any) => {
  navigator = nav;
};

export const navigate = (path: string) => {
  navigator(path);
};