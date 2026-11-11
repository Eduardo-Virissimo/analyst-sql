-- o cliente do init do Docker usa latin1 por padrão; sem isto os acentos são gravados duplamente codificados
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS hr_agent;
CREATE DATABASE hr_agent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hr_agent;

CREATE TABLE departments (
  id   INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT 'Nome do setor',
  code VARCHAR(10)  NOT NULL COMMENT 'Sigla do setor, ex: TI, RH'
) COMMENT = 'Setores da instituição';

CREATE TABLE employees (
  id            INT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL COMMENT 'Nome do colaborador',
  email         VARCHAR(120) NOT NULL,
  department_id INT NOT NULL COMMENT 'Setor onde a pessoa trabalha',
  job_title     VARCHAR(80)  NOT NULL COMMENT 'Cargo',
  FOREIGN KEY (department_id) REFERENCES departments(id)
) COMMENT = 'Colaboradores: pessoas que trabalham ou já trabalharam na instituição';

CREATE TABLE employments (
  id           INT PRIMARY KEY,
  employee_id  INT NOT NULL,
  type         ENUM('permanent','temporary','internship','outsourced') NOT NULL
               COMMENT 'Tipo de vínculo: permanent = efetivo, temporary = temporário, internship = estágio, outsourced = terceirizado',
  start_date   DATE NOT NULL COMMENT 'Data de início do vínculo',
  end_date     DATE NULL COMMENT 'Data de encerramento; NULL enquanto o vínculo está ativo',
  weekly_hours INT NOT NULL COMMENT 'Carga horária semanal',
  status       ENUM('active','ended') NOT NULL COMMENT 'Situação: active = ativo, ended = encerrado',
  end_reason   VARCHAR(60) NULL COMMENT 'Motivo do encerramento (em português); preenchido só quando status = ended',
  FOREIGN KEY (employee_id) REFERENCES employees(id)
) COMMENT = 'Vínculos de trabalho (contratos) de cada colaborador';

INSERT INTO departments (id, name, code) VALUES
(1, 'Recursos Humanos', 'RH'),
(2, 'Tecnologia da Informação', 'TI'),
(3, 'Financeiro', 'FIN'),
(4, 'Biblioteca', 'BIB'),
(5, 'Secretaria Acadêmica', 'SEC'),
(6, 'Manutenção', 'MAN');

INSERT INTO employees (id, name, email, department_id, job_title) VALUES
(1, 'Ana Souza', 'ana1@exemplo.edu.br', 6, 'Eletricista'),
(2, 'Bruno Almeida', 'bruno2@exemplo.edu.br', 5, 'Secretário Acadêmico'),
(3, 'Carla Martins', 'carla3@exemplo.edu.br', 6, 'Técnico de Manutenção'),
(4, 'Diego Almeida', 'diego4@exemplo.edu.br', 6, 'Técnico de Manutenção'),
(5, 'Elisa Souza', 'elisa5@exemplo.edu.br', 3, 'Contador'),
(6, 'Felipe Costa', 'felipe6@exemplo.edu.br', 5, 'Secretário Acadêmico'),
(7, 'Gabriela Costa', 'gabriela7@exemplo.edu.br', 5, 'Assistente Administrativo'),
(8, 'Henrique Martins', 'henrique8@exemplo.edu.br', 1, 'Analista de RH'),
(9, 'Isabela Costa', 'isabela9@exemplo.edu.br', 4, 'Auxiliar de Biblioteca'),
(10, 'João Martins', 'joão10@exemplo.edu.br', 2, 'Analista de Suporte'),
(11, 'Karina Lima', 'karina11@exemplo.edu.br', 2, 'Analista de Suporte'),
(12, 'Lucas Rodrigues', 'lucas12@exemplo.edu.br', 6, 'Eletricista'),
(13, 'Mariana Pereira', 'mariana13@exemplo.edu.br', 1, 'Assistente Administrativo'),
(14, 'Nicolas Lima', 'nicolas14@exemplo.edu.br', 6, 'Eletricista'),
(15, 'Olívia Costa', 'olivia15@exemplo.edu.br', 5, 'Assistente Administrativo'),
(16, 'Pedro Gomes', 'pedro16@exemplo.edu.br', 2, 'Analista de Suporte'),
(17, 'Quésia Souza', 'quesia17@exemplo.edu.br', 5, 'Assistente Administrativo'),
(18, 'Rafael Silva', 'rafael18@exemplo.edu.br', 5, 'Secretário Acadêmico'),
(19, 'Sofia Souza', 'sofia19@exemplo.edu.br', 3, 'Assistente Financeiro'),
(20, 'Tiago Souza', 'tiago20@exemplo.edu.br', 5, 'Assistente Administrativo'),
(21, 'Úrsula Gomes', 'ursula21@exemplo.edu.br', 5, 'Secretário Acadêmico'),
(22, 'Vinícius Rodrigues', 'vinicius22@exemplo.edu.br', 1, 'Assistente Administrativo'),
(23, 'Yasmin Souza', 'yasmin23@exemplo.edu.br', 1, 'Assistente Administrativo'),
(24, 'Wagner Ribeiro', 'wagner24@exemplo.edu.br', 5, 'Assistente Administrativo'),
(25, 'Beatriz Costa', 'beatriz25@exemplo.edu.br', 6, 'Técnico de Manutenção'),
(26, 'Caio Lima', 'caio26@exemplo.edu.br', 5, 'Secretário Acadêmico'),
(27, 'Daniela Gomes', 'daniela27@exemplo.edu.br', 5, 'Secretário Acadêmico'),
(28, 'Eduarda Silva', 'eduarda28@exemplo.edu.br', 1, 'Assistente Administrativo'),
(29, 'Fábio Oliveira', 'fabio29@exemplo.edu.br', 5, 'Assistente Administrativo'),
(30, 'Giovana Almeida', 'giovana30@exemplo.edu.br', 3, 'Assistente Financeiro'),
(31, 'Heitor Souza', 'heitor31@exemplo.edu.br', 6, 'Eletricista'),
(32, 'Lívia Almeida', 'livia32@exemplo.edu.br', 2, 'Desenvolvedor'),
(33, 'Marcos Lima', 'marcos33@exemplo.edu.br', 1, 'Analista de RH'),
(34, 'Natália Pereira', 'natalia34@exemplo.edu.br', 1, 'Analista de RH'),
(35, 'Otávio Almeida', 'otavio35@exemplo.edu.br', 2, 'Desenvolvedor'),
(36, 'Paula Costa', 'paula36@exemplo.edu.br', 2, 'Desenvolvedor'),
(37, 'Renata Rodrigues', 'renata37@exemplo.edu.br', 6, 'Eletricista'),
(38, 'Samuel Oliveira', 'samuel38@exemplo.edu.br', 5, 'Secretário Acadêmico'),
(39, 'Tatiane Ribeiro', 'tatiane39@exemplo.edu.br', 1, 'Analista de RH'),
(40, 'Vitor Souza', 'vitor40@exemplo.edu.br', 5, 'Assistente Administrativo');

INSERT INTO employments (id, employee_id, type, start_date, end_date, weekly_hours, status, end_reason) VALUES
(1, 1, 'outsourced', '2021-01-31', '2021-12-26', 30, 'ended', 'pedido de demissão'),
(2, 2, 'permanent', '2019-01-19', '2019-07-12', 30, 'ended', 'fim de contrato'),
(3, 3, 'permanent', '2023-01-14', '2023-05-27', 40, 'ended', 'fim de contrato'),
(4, 4, 'permanent', '2019-09-29', NULL, 30, 'active', NULL),
(5, 5, 'temporary', '2019-02-01', NULL, 40, 'active', NULL),
(6, 6, 'outsourced', '2023-02-25', '2025-08-08', 40, 'ended', 'pedido de demissão'),
(7, 7, 'internship', '2020-02-27', NULL, 20, 'active', NULL),
(8, 8, 'permanent', '2018-11-23', NULL, 30, 'active', NULL),
(9, 9, 'outsourced', '2022-02-03', NULL, 30, 'active', NULL),
(10, 10, 'outsourced', '2025-08-31', '2026-09-24', 40, 'ended', 'fim de contrato'),
(11, 11, 'permanent', '2025-03-06', NULL, 40, 'active', NULL),
(12, 12, 'permanent', '2018-05-12', NULL, 40, 'active', NULL),
(13, 13, 'permanent', '2025-05-08', NULL, 40, 'active', NULL),
(14, 14, 'permanent', '2019-07-26', NULL, 30, 'active', NULL),
(15, 15, 'internship', '2022-06-24', NULL, 20, 'active', NULL),
(16, 16, 'permanent', '2018-07-12', '2019-10-02', 30, 'ended', 'dispensa'),
(17, 17, 'temporary', '2024-09-06', NULL, 40, 'active', NULL),
(18, 18, 'outsourced', '2024-01-09', NULL, 40, 'active', NULL),
(19, 19, 'temporary', '2019-10-10', '2021-07-30', 40, 'ended', 'fim de contrato'),
(20, 20, 'outsourced', '2023-09-11', '2026-02-12', 40, 'ended', 'fim de contrato'),
(21, 21, 'internship', '2021-08-20', NULL, 20, 'active', NULL),
(22, 22, 'permanent', '2018-08-26', NULL, 30, 'active', NULL),
(23, 23, 'permanent', '2023-12-22', '2026-09-06', 30, 'ended', 'aposentadoria'),
(24, 24, 'permanent', '2024-01-18', NULL, 40, 'active', NULL),
(25, 25, 'outsourced', '2025-04-15', NULL, 40, 'active', NULL),
(26, 26, 'permanent', '2020-07-09', NULL, 30, 'active', NULL),
(27, 27, 'internship', '2020-06-21', '2021-02-16', 20, 'ended', 'fim de contrato'),
(28, 28, 'permanent', '2023-10-07', '2026-10-25', 30, 'ended', 'fim de contrato'),
(29, 29, 'permanent', '2023-04-22', '2024-03-05', 40, 'ended', 'dispensa'),
(30, 30, 'temporary', '2018-08-10', NULL, 40, 'active', NULL),
(31, 31, 'temporary', '2021-10-21', '2023-03-14', 30, 'ended', 'dispensa'),
(32, 32, 'permanent', '2023-03-10', NULL, 30, 'active', NULL),
(33, 33, 'permanent', '2025-04-25', NULL, 40, 'active', NULL),
(34, 34, 'temporary', '2023-06-13', '2026-01-09', 40, 'ended', 'pedido de demissão'),
(35, 35, 'temporary', '2020-12-22', '2024-01-12', 40, 'ended', 'fim de contrato'),
(36, 36, 'permanent', '2024-06-30', NULL, 40, 'active', NULL),
(37, 37, 'permanent', '2024-07-20', NULL, 40, 'active', NULL),
(38, 38, 'internship', '2018-11-25', NULL, 20, 'active', NULL),
(39, 39, 'outsourced', '2020-08-21', '2022-05-07', 40, 'ended', 'pedido de demissão'),
(40, 40, 'outsourced', '2024-07-18', NULL, 40, 'active', NULL);

-- SOMENTE LEITURA usado pelo agente.

DROP USER IF EXISTS 'agent_readonly'@'%';
CREATE USER 'agent_readonly'@'%' IDENTIFIED BY 'change_this_password';
GRANT SELECT ON hr_agent.* TO 'agent_readonly'@'%';
FLUSH PRIVILEGES;
