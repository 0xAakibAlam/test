export const masterAnonqaAddress = "0x6578C29E33c9e9f4882585Fd6a485c1ff83E8F37";
export const admin = "";

export const masterAnonqaABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "AnswerAlreadyGiven", type: "error" },
  { inputs: [], name: "EmptyQuestion", type: "error" },
  { inputs: [], name: "EmptyQuestionTitle", type: "error" },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "ExpectedPause", type: "error" },
  { inputs: [], name: "InvalidInitialization", type: "error" },
  { inputs: [], name: "InvalidQuestion", type: "error" },
  { inputs: [], name: "NotAdmin", type: "error" },
  { inputs: [], name: "NotBot", type: "error" },
  { inputs: [], name: "NotInitializing", type: "error" },
  { inputs: [], name: "QuestionAlreadyBorned", type: "error" },
  { inputs: [], name: "QuestionIsAlive", type: "error" },
  { inputs: [], name: "QuestionIsDead", type: "error" },
  { inputs: [], name: "QuestionLifeTimeTooMuch", type: "error" },
  { inputs: [], name: "QuestionNotBorned", type: "error" },
  { inputs: [], name: "QuestionSentToHeaven", type: "error" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_anonqaConfig",
        type: "address",
      },
    ],
    name: "AnonqaConfigUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_questionId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_answerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_answer",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "AnswerPosted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_questionId",
        type: "bytes32",
      },
    ],
    name: "FuneralCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxQuestionLifeTime",
        type: "uint256",
      },
    ],
    name: "MaxQuestionLifeTimeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_questionId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_questionTitle",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_question",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
    ],
    name: "QuestionBorned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_anonqaConfig", type: "address" },
      {
        internalType: "uint256",
        name: "_maxQuestionLifeTime",
        type: "uint256",
      },
    ],
    name: "__MasterQA_Init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "anonqaConfig",
    outputs: [
      { internalType: "contract IAnonqaConfig", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "answerData",
    outputs: [
      { internalType: "bytes32", name: "questionId", type: "bytes32" },
      { internalType: "bytes32", name: "answerId", type: "bytes32" },
      { internalType: "string", name: "answer", type: "string" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "_questionIds", type: "bytes32[]" },
    ],
    name: "funeral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_questionId", type: "bytes32" }],
    name: "getAnswerInfo",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "questionId", type: "bytes32" },
          { internalType: "bytes32", name: "answerId", type: "bytes32" },
          { internalType: "string", name: "answer", type: "string" },
          { internalType: "address", name: "owner", type: "address" },
        ],
        internalType: "struct IMasterAnonqa.AnswerInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_questionId", type: "bytes32" }],
    name: "getQuestionInfo",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "questionId", type: "bytes32" },
          { internalType: "string", name: "questionTitle", type: "string" },
          { internalType: "string", name: "question", type: "string" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          { internalType: "bool", name: "sentToHeaven", type: "bool" },
        ],
        internalType: "struct IMasterAnonqa.QuestionInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxQuestionLifeTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_questionId", type: "bytes32" },
      { internalType: "string", name: "_answer", type: "string" },
    ],
    name: "postAnswer",
    outputs: [{ internalType: "bytes32", name: "_answerId", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_questionTitle", type: "string" },
      { internalType: "string", name: "_question", type: "string" },
      { internalType: "uint256", name: "_endTime", type: "uint256" },
    ],
    name: "postQuestion",
    outputs: [
      { internalType: "bytes32", name: "_questionId", type: "bytes32" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "questionData",
    outputs: [
      { internalType: "bytes32", name: "questionId", type: "bytes32" },
      { internalType: "string", name: "questionTitle", type: "string" },
      { internalType: "string", name: "question", type: "string" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "bool", name: "sentToHeaven", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "questionIds",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxQuestionLifeTime",
        type: "uint256",
      },
    ],
    name: "setMaxQuestionLifeTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalQuestions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_anonqaConfig", type: "address" },
    ],
    name: "updateAnonqaConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
