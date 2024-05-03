import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { config } from 'dotenv';
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
    console.log(this.folderPath);

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

  async initQuestionWithScore(query) {
    const res = await this.vectorstore?.similaritySearchWithScore(query);
    // score luôn nhỏ hơn 1 vì tính toán  cosine_similarity(A, B) = (A . B) / (||A|| * ||B||)
    // cosine_distance(A, B) = 1 - cosine_similarity(A, B)
    if (!res || !res[0]) return '-1 Không tìm thấy trong bộ câu hỏi';
    return res;
  }
}

export const langchainLibEmbedded = new LangChainLib('src/data');
