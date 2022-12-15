const MODE = import.meta.env.MODE // 环境变量

export const baseUrl = MODE == 'development' ? 'http://127.0.0.1:8066' : 'http://116.204.107.20:8066'