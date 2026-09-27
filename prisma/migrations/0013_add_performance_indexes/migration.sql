-- Fase performance (agente `backend`/F12) — índices ADITIVOS para consultas frequentes.
-- 100% ADDITIVO: sem DROP, sem backfill, sem renomear colunas/tabelas (CLAUDE.md §10/§30).
-- Os nomes dos índices ESPELHAM o que o Prisma geraria (`Model_coluna_coluna_idx`),
-- garantindo zero drift em `prisma migrate deploy`.

-- Dedupe server-side de enunciados: `Question.statementHash` (opcional, único).
ALTER TABLE "Question" ADD COLUMN "statementHash" TEXT;
CREATE UNIQUE INDEX "Question_statementHash_key" ON "Question"("statementHash");

-- Listagem admin de questões por matéria+banca / matéria+dificuldade / banca+dificuldade.
CREATE INDEX "Question_subjectId_board_idx" ON "Question"("subjectId", "board");
CREATE INDEX "Question_subjectId_difficulty_idx" ON "Question"("subjectId", "difficulty");
CREATE INDEX "Question_board_difficulty_idx" ON "Question"("board", "difficulty");

-- Listagem admin com filtro de status/tombamento ordenada por criação.
CREATE INDEX "Question_status_deletedAt_createdAt_idx" ON "Question"("status", "deletedAt", "createdAt");

-- Correção de simulado: alternativas em ordem (evita ORDER BY na correção).
CREATE INDEX "QuestionOption_questionId_order_idx" ON "QuestionOption"("questionId", "order");

-- Montagem de simulado: questões em ordem.
CREATE INDEX "MockExamQuestion_mockExamId_order_idx" ON "MockExamQuestion"("mockExamId", "order");

-- Retomada de tentativa e histórico do usuário.
CREATE INDEX "MockExamAttempt_userId_startedAt_idx" ON "MockExamAttempt"("userId", "startedAt");
CREATE INDEX "MockExamAttempt_userId_mockExamId_status_idx" ON "MockExamAttempt"("userId", "mockExamId", "status");

-- Catálogo de cursos por concurso+status+tombamento.
CREATE INDEX "Course_contestId_status_deletedAt_idx" ON "Course"("contestId", "status", "deletedAt");

-- Recálculo de ranking por versão, ordenado por pontuação.
CREATE INDEX "RankingScore_calculationVersion_score_idx" ON "RankingScore"("calculationVersion", "score");
