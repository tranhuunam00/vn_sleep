import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { config } from 'dotenv';
import sleepQaApp from './sleepQA';
import { chatWithOpenAI, getSLeepFromAI } from './openAi';
config();

class LangChainLib {
  embeddings: OpenAIEmbeddings = null;
  model: OpenAI = null;
  folderPath: string = null;
  vectorstore: FaissStore = null;
  chain: RetrievalQAChain = null;

  constructor(folderPath: string) {
    this.embeddings = new OpenAIEmbeddings();
    this.model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: 'gpt-3.5-turbo',
    });
    this.folderPath = folderPath;
    this.loadIndexToChain();
  }

  async indexesOwnData(fileName: string) {
    this.embeddings = new OpenAIEmbeddings();

    const loader = new TextLoader(fileName);
    const docs = await loader.load();

    const splitter = new CharacterTextSplitter({
      chunkSize: 6,
      chunkOverlap: 0,
      separator: '\n',
    });

    const documents = await splitter.splitDocuments(docs);
    this.vectorstore = await FaissStore.fromDocuments(
      documents,
      this.embeddings,
    );
    await this.vectorstore.save(this.folderPath);
  }

  async loadIndexToChain() {
    this.vectorstore = await FaissStore.load(this.folderPath, this.embeddings);
    this.chain = new RetrievalQAChain({
      combineDocumentsChain: loadQAStuffChain(this.model),
      retriever: this.vectorstore.asRetriever(),
      returnSourceDocuments: true,
    });
    // this.chainVertexAi = new GoogleVertexAISearchRetriever
  }

  async predict(query) {
    const res = await this.chain?.call(
      {
        query,
      },
      {},
    );
    return res;
  }
  async initQuestion(query: string) {
    const res = await this.vectorstore?.similaritySearch(query);
    if (!res || !res[0]) return '-1 Không tìm thấy trong bộ câu hỏi';
    return res[0].pageContent;
  }

  async initQuestionWithScore(query: string) {
    const res = await this.vectorstore?.similaritySearchWithScore(query, 4);
    // score luôn nhỏ hơn 1 vì tính toán  cosine_similarity(A, B) = (A . B) / (||A|| * ||B||)
    // cosine_distance(A, B) = 1 - cosine_similarity(A, B)
    if (!res || !res[0]) return [];
    return res;
  }
}

export const langchainLibEmbedded = new LangChainLib('src/data');

export const chatBotSleepWithLangChain = async (text: string) => {
  const data = await langchainLibEmbedded.initQuestionWithScore(text);

  const score = data[0][1];
  const score2 = data[1][1];

  console.log(data);
  let dataReturn: string = '';

  if (+score < 0.1) {
    dataReturn = sleepQaApp.qa[data[0][0]['pageContent']];
    return {
      msg: dataReturn,
      isOwn: true,
    };
  }

  if (+score < 0.2 && +score < +score2 - 0.05) {
    dataReturn = data[0][0]['pageContent'];
    return {
      msg: dataReturn,
      isOwn: true,
    };
  }

  const stringData = data.reduce((prev, curr, index) => {
    prev =
      prev +
      `\n Câu ${index}: ${curr[0]['pageContent']} có trọng số là ${(1 - +curr[1]) * 100}`;
    return prev;
  }, '');
  if (!dataReturn && +score < 0.3) {
    dataReturn = await getSLeepFromAI(stringData, text);
    return {
      msg: dataReturn,
      isOwn: false,
    };
  }
  if (!dataReturn && +score >= 0.3) {
    dataReturn = await chatWithOpenAI(text);
    return {
      msg: dataReturn,
      isOwn: false,
    };
  }
  return {
    msg: dataReturn,
    isOwn: false,
  };
};
