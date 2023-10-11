<script setup lang="ts">
import { usePromoStore } from '../stores/PromoStore';
const promoStore = usePromoStore();
import { useBookingStore } from '../stores/BookingStore';
const bookingStore = useBookingStore();
const closeSidebar = () => {
  promoStore.sideBarOpen = false;
  bookingStore.sideBarOpen = false;
};
</script>
<template>
  <Transition name="slide-fade">
    <section
      v-if="promoStore.sideBarOpen"
      id="side-bar"
      class="p-6 overflow-y-auto w-full md:w-[500px] right-0 fixed bg-white sidebar"
    >
      <div class="title-sidebar">
        <span class="text-2xl font-bold flex gap-2 items-center">
          <Icon name="teenyicons:discount-outline" size="1.6rem" color="#114E8C" />
          Promos Grupo BRT</span
        >
        <button @click="closeSidebar()">
          <Icon name="ic:baseline-arrow-forward" size="2rem" color="#114E8C" />
        </button>
      </div>
      <div class="text-xs">
        Aproveite os descontos e promoções especiais que o Grupo BRT disponibiliza para você toda semana!
      </div>
      <section class="flex mt-4 flex-col gap-4" v-for="(promo, index) in promoStore.promosList" :key="index">
        <div class="w-full h-40 overflow-hidden">
          <nuxt-img :src="promo.urlToImage" v-if="promo.urlToImage" fit="cover" width="100%" height="100" />
        </div>
        <div class="text-sm font-bold">
          {{ promo.title }}
        </div>
        <div class="text-xs">
          {{ promo.description }}
        </div>
      </section>
    </section>
  </Transition>
  <!-- SIDE BAR DE TERMOS DE USOS DA TELA DE BOOKING -->
  <Transition name="slide-fade">
    <section
      v-if="bookingStore.sideBarOpen"
      id="side-bar"
      class="p-6 overflow-y-auto w-full md:w-[500px] right-0 fixed bg-white sidebar"
    >
      <div class="title-sidebar">
        <span class="text-2xl font-bold flex gap-2 items-center">
          <Icon name="teenyicons:discount-outline" size="1.6rem" color="#114E8C" />
          Condições Gerais de Reserva</span
        >
        <button @click="closeSidebar()">
          <Icon name="ic:baseline-arrow-forward" size="2rem" color="#114E8C" />
        </button>
      </div>
      <section class="flex mt-4 flex-col gap-4">
        <div class="container-general-terms">
          <p>
            O conteúdo destas condições gerais foi elaborado de acordo com a legislação em vigor e, especificamente, com
            o Código de Proteção e Defesa do Consumidor e a Deliberação Normativa da EMBRATUR nº 161/85. Estas Condições
            Gerais serão válidas para todos os produtos e pacotes comprados através das centrais de atendimento ou
            através do Portal da BRT Operadora.
          </p>
          <p>
            Entende-se por: BRT OPERADORA: Brementur Agência de Turismo Ltda., estabelecida à Rua Presidente Faria, nº
            321, Centro, Curitiba-PR, inscrita no CNPJ sob o nº 77.636.074.0004-96, que opera como intermediária na
            compra e venda de serviços de viagens e turismo entre as agências de turismo e os prestadores desses
            serviços. Tais serviços podem ser nacionais ou internacionais, ofertados em parceria com empresas de
            receptivo, transporte aéreo, terrestre, marítimo, fluvial, hotéis e similares, parques, assistências e
            seguros de viagem, entre outros. AGÊNCIA: a agência de viagens e turismo que, em nome dos passageiros,
            contrata os serviços e pacotes ofertados pela Operadora. CONTRATANTE: corresponde ao líder do grupo, “cabeça
            do casal” ou pagante, sendo este responsável por si e pelas demais pessoas para quem as reservas são feitas.
            Representa os viajantes que usufruirão dos serviços, nos termos do art. 1º, §2º, item “b” da Deliberação
            Normativa da EMBRATUR nº 161/85. Este também é responsável pela veracidade das informações prestadas à
            Agência e no ato de preenchimento dos documentos e formulários. PORTAL: website da internet, de acesso
            restrito ao agente de viagens com nome de usuário e senha válidos, dedicados apenas a agências de turismo
            devidamente cadastradas na BRT OPERADORA. ALTERAÇÃO CONTRATUAL: é a alteração, por iniciativa exclusiva do
            CONTRATANTE e com antecedência mínima de pelo menos 01 (um) dia da data da viagem, das condições contratuais
            inicialmente formalizadas, tais como: destinos, passageiros, data e horário de embarque, desembarque,
            traslados, hospedagens, bilhetes aéreos, transportes rodoviários, locação de veículos, entre outras
            modificações no programa de viagem reservado e adquirido. RESCISÃO: é a decisão unilateral do CONTRATANTE em
            rescindir o seu contrato com antecedência mínima de 01 (um) dia da data da viagem. NÃO COMPARECIMENTO:
            importa no não comparecimento do CONTRATANTE e/ou passageiros, na hora e local marcados para o início de
            prestação dos serviços contratados.
          </p>
          <h4>CONDIÇÕES PARA RESERVA E PAGAMENTO</h4>
          <p>
            A solicitação de reserva, bem como a posterior confirmação de compra dos serviços solicitados, deverá ser
            feita por escrito, preferencialmente via e-mail. Toda solicitação de reserva deverá estar acompanhada do
            respectivo comprovante de pagamento do sinal, determinado em propaganda promocional veiculada ou autorizada
            pela operadora ou por cotação enviada anteriormente via e-mail. Caso a AGÊNCIA não honre o pagamento
            correspondente ao serviço reservado, no prazo estipulado, a BRT OPERADORA cancelará automaticamente e
            integralmente a reserva. As reclamações pelo ressarcimento por eventuais prejuízos sofridos por parte do
            CONTRATANTE deverão ser realizadas diretamente perante a AGÊNCIA. Reservas solicitadas dentro do prazo de 07
            (sete) dias úteis, antes da data do embarque ou início da prestação dos serviços, serão passíveis da
            cobrança do valor integral do serviço, conforme condições específicas para cada produto ou serviço, além de
            pagamento de uma taxa de comunicação. A complementação do pagamento deverá ser feita no prazo máximo de 24
            (vinte e quatro) horas, após a confirmação dos serviços solicitados, sob pena de cancelamento da reserva e
            aplicação das penalidades de cancelamento previstas no item 3 deste documento (condições gerais de
            cancelamento). Os preços dos serviços intermediados são válidos para os períodos indicados nos meios de
            propaganda utilizados e autorizados pela BRT OPERADORA (tais como folhetos, cadernos, lâminas, e-mails,
            cotações, etc.), podendo ocorrer alterações supervenientes em decorrência de variações cambiais, casos
            fortuitos ou de força maior, tarifas aplicadas por determinação de autoridades competentes e de resoluções
            governamentais. Fica o CONTRATANTE ciente de que os serviços ora contratados são meramente de intermediação
            de serviços de turismo executados por terceiros fornecedores (transportadoras aéreas, marítimas e
            rodoviárias, receptivos, hotéis, restaurantes, locadora de veículos, etc.) razão pela qual tais fornecedores
            poderão exigir do CONTRATANTE a aplicação de eventuais penalidades adicionais às elencadas neste documento.
          </p>
          <h4>ALTERAÇÃO CONTRATUAL</h4>
          <p>
            O CONTRATANTE poderá solicitar alterações nos produtos e serviços adquiridos, tendo, porém, plena ciência de
            que ficará sujeito às eventuais penalidades estipuladas pelos efetivos prestadores de serviços de viagens e
            turismo, as quais podem variar conforme condições específicas de cada empresa. A variação de tarifas
            eventualmente devidas aos fornecedores será arcada exclusivamente pelo CONTRATANTE. A alteração contratual é
            aquela que, por iniciativa exclusiva do CONTRATANTE, e com antecedência mínima de 01 (um) dia antes da data
            da viagem, modifique alguma das condições pactuadas (destinos, passageiros, data e horários de embarque,
            desembarque, traslados, hospedagens, bilhetes aéreos, transportes rodoviários, etc.) originalmente com a
            AGÊNCIA. As condições de alteração e cancelamento também estarão descritas (de forma idêntica ou
            suplementar) nas condições específicas de cada produto ou serviço, determinadas pelos prestadores dos
            serviços. Havendo alteração contratual, o CONTRATANTE deverá efetuar pagamento de adicional à BRT OPERADORA
            para efetiva remarcação e modificação dos produtos e serviços. O adicional será cobrado sem prejuízo da
            aplicação de multa e/ou valores fixos feita pelos fornecedores dos serviços atingidos. Eventual dispensa do
            pagamento, consubstancia-se em mera liberalidade decida por critério exclusivo da BRT OPERADORA. O
            CONTRATANTE continuará responsável pelo pagamento dos serviços turísticos na forma contratada, mesmo na
            hipótese de transferência (quando possível) para outras pessoas usufruírem dos produtos ou serviços
            adquiridos. O valor necessário para remarcação ou antecipação de datas ou horários de
            embarque/check-in/passeios terá como referência o valor originalmente pago, não cabendo restituição caso o
            valor seja inferior ao previamente contratado. No caso de antecipação da data de embarque poderá haver
            aumento e alteração dos valores. A aquisição de produtos ou serviços com tarifas promocionais (vide item
            3.7) terá condições específicas de alteração, remarcação e antecipações específicas.
          </p>
          <h4>CONDIÇÕES GERAIS DE CANCELAMENTO</h4>
          <p>
            Considera-se como cancelamento a desistência por interesse do CONTRATANTE da viagem e/ou serviços
            adquiridos, ou o não comparecimento (no-show), bem como o não embarque, ou impedimento de entrar no país em
            razão de retenção do CONTRATANTE e/ou passageiro(s) para fiscalização (vide item 7.7.2). A solicitação de
            cancelamento de viagem ou de serviços contratados pelo CONTRATANTE deverá ser feita por escrito, com
            antecedência mínima de 01 (um dia) da data da viagem. 3.2.1. Serão aplicadas penalidades, no caso da
            solicitação de cancelamento, em razão das despesas operacionais tidas em função da prestação do serviço,
            independentemente da sua fruição, nos seguintes termos: 3.2.1.1. Para hipóteses em que o cancelamento
            ocorrer com 8 (oito) dias ou mais de antecedência da data de início da viagem, será aplicada multa será de
            10% (dez por cento) sobre o valor total da viagem e/ou serviços contratados; 3.2.1.2. Em situações em que o
            cancelamento se der com 1 (um) a 7 (sete) dias de antecedência da data do início da viagem, a multa
            aplicável será de 20% (vinte por cento) sobre o valor total da viagem e/ou serviços contratados; A cobrança
            da penalidade por parte da BRT OPERADORA não exclui e nem se confunde com a possibilidade de cobrança da
            multa do fornecedor do serviço. A eventual cobrança de multa ou penalidade diversa pelo fornecedor dos
            serviços será repassada ao CONTRATANTE. Em caso de desistência da viagem após seu início (no seu
            transcurso), ou na hipótese de não utilização de quaisquer dos serviços adquiridos pelo CONTRANTANTE e/ou
            passageiro(s), não será concedido qualquer tipo de reembolso ou indenização. As condições de cancelamento
            determinadas nas condições específicas de cada produto (enviadas via e-mail ao CONTRATANTE) poderão ser
            diferentes das descritas neste tópico. Neste caso, prevalecerão as condições de cancelamento previstas nas
            condições específicas previamente informadas ao CONTRATANTE por e-mail, ou diretamente pelo Portal. Os
            valores reembolsáveis serão creditados à AGÊNCIA, descontando-se as comissões já pagas a ela, a quem o
            CONTRATANTE deverá recorrer para recebimento do valor de reembolso. 3.5.1. O reembolso será feito tendo em
            vista as especificidades do caso, incluindo a forma de pagamento adotada pelo CONTRATANTE. Será considerado
            não comparecimento (no-show) a ausência do CONTRATANTE e/ou passageiro(s), na hora e local marcados para o
            início dos serviços. Ocorrendo o não comparecimento, estará sujeito o CONTRATANTE: Quando e se autorizado
            pelos respectivos fornecedores, a remarcação dos serviços turísticos, com aplicação da penalidade de 20%
            (vinte por cento) sobre o valor total da contratação, além de eventual outros custos de remarcação do
            próprio fornecedor; Quando autorizado pelos respectivos fornecedores, a restituição dos valores pagos
            (reembolso), com aplicação de multa de 30% (trinta por cento) sobre o valor total da contratação, além de
            eventual outros custos de restituição do próprio fornecedor; Não se incluem no valor da multa as perdas e
            danos ocorridos em razão do não comparecimento (no show), que também serão objeto de cobrança. Como regra,
            não será reembolsável a tarifa ofertada em caráter promocional sob nenhuma hipótese. Define-se por tarifa
            promocional aquela ofertada em valor diferenciado e que não possa ser alterada em nenhuma circunstância no
            tocante a qualquer um de seus dados (itinerários, tipos de acomodação, regime de alimentação, datas,
            redução/extensão de estadia, passageiros, bem como na hipótese de cancelamento ou não comparecimento). As
            tarifas promocionais não poderão ser objeto das alterações contratuais previstas no item 2 deste documento.
            Não se aplicam as regras previstas nos itens 2 e 3 deste documento, para as tarifas pagas diretamente à(s)
            empresa(s) fornecedora(s) de serviços de turismo.
          </p>
          <h4>SERVIÇOS NÃO INCLUSOS</h4>
          <p>
            Os preços divulgados incluem os serviços previamente descritos nos pacotes ofertados, porém, não incluem:
            Taxas de embarque, segurança e combustível; Taxas de serviço de hotéis; Excesso de bagagem; Gorjetas ou
            qualquer outro tipo de gratificação; Guias turísticos, exceto se estiverem expressamente incluídos no
            serviço de viagem e turismo contratado; Alimentos e/ou bebidas servidas no apartamento, disponibilizadas em
            frigobar ou afins, ou não incluídas no serviço solicitado; Despesas como lavanderia, correio, cabelereiro,
            serviços telefônicos e de comunicação eletrônica; Despesas com documentação pessoal, tais como visto,
            passaporte, cédula de identidade, etc.; Despesas com passeios opcionais não incluídos no serviço contratado;
            Pernoites que excedam o período contratado; Upgrades, exceto se oferecidos pela própria operadora; Impostos
            e taxas turísticas locais. O rol de serviços e taxas descritos acima não é exaustivo. O pagamento dos
            valores das taxas, despesas e serviços elencados no rol acima é de responsabilidade exclusiva do
            CONTRATANTE.
          </p>
          <h4>HOSPEDAGEM E ALIMENTAÇÃO</h4>
          <p>
            Os horários de ingresso nos apartamentos e/ou cabines (check-in) e de saída (check-out) deverão ser
            informados ao CONTRATANTE pela AGÊNCIA, observadas as regras de cada prestador de serviço, e as variações
            que podem ocorrer de acordo com a localidade e fuso. A AGÊNCIA deverá solicitar por escrito os detalhes da
            acomodação e encaminhá-las para o CONTRATANTE e/ou passageiros.
          </p>
          <p>
            Em alguns hotéis, o terceiro e quarto leito poderão ser: cama articulada, sofá-cama ou beliche. Os detalhes
            específicos serão fornecidos e explicados pela AGÊNCIA no momento do fechamento do pacote. Na eventual
            impossibilidade de acomodação nos hotéis apontados no pacote turístico ofertado pela BRT OPERADORA, poderá
            ocorrer a substituição por outro similar, da mesma categoria turística, mantendo-se o padrão de qualidade
            oferecido, sem qualquer prejuízo para o serviço contratado, independentemente de alterações no preço do
            pacote. Se contratado o serviço de alimentação, este estará previsto nas condições específicas do serviço.
            As refeições eventualmente incluídas nos pacotes ofertados pela BRT OPERADORA poderão ser servidas em
            qualquer restaurante, dentro ou fora do hotel, de acordo com a programação do pacote adquirido e estará
            necessariamente indicada nas condições específicas. Se o CONTRATANTE e/ou passageiro(s) necessitar de dieta
            alimentar especial ou do consumo de algum alimento ou item específico, este deverá se responsabilizar em
            contatar previamente as empresa(s) prestadora(s) do(s) serviço(s) sobre a possibilidade do atendimento da
            necessidade especial, a qual, inclusive, poderá ser cobrada adicionalmente.
          </p>
          <h4>TRASLADOS E BAGAGEM</h4>
          <p>
            Os traslados e passeios são serviços regulares de turismo, que deverão ser especificamente contratados, e
            que poderão ou não ser compartilhados com outras pessoas, caso em que serão feitos em veículos que comportem
            o número total de passageiros presentes. As bagagens e demais objetos pessoais são de responsabilidade
            exclusiva do CONTRATANTE, bem como das empresas transportadoras envolvidas, não fazendo parte do serviço de
            intermediação prestado pela BRT OPERADORA. A BRT OPERADORA também não se responsabiliza pela hipótese de
            perda, furto, roubo extravio ou danos ocorridos durante toda a viagem e hospedagem com as bagagens e objetos
            pessoais do CONTRATANTE e/ou passageiros, independentemente do meio de transporte escolhido pelo
            CONTRATANTE. Na hipótese de ocorrência de qualquer uma destas situações descritas acima, o CONTRATANTE e/ou
            passageiro deverá registrar, no ato, uma reclamação formal e escrita perante a empresa prestadora dos
            serviços, transportadora, companhia aérea, hotel, e autoridades competentes. Recomenda-se que o CONTRATANTE
            contrate um serviço de assistência de viagem (seguro viagem), que poderá colaborar com, dentre outras
            vantagens e garantias, a localização de bagagens e indenizações por perdas, danos ou extravio - sendo
            possível o adiantamento ou reembolso do respectivo valor. A BRT OPERADORA não se responsabiliza pela
            segurança de quaisquer documentos que estão na posse da AGÊNCIA, CONTRATANTE e/ou passageiros, inclusive
            aqueles necessários à viagem, bem como objetos pessoais e/ou de elevado valor dos passageiros. Recomenda-se,
            como medida de cautela e proteção, verificar se as unidades habitacionais do hotel e/ou o navio dispõem de
            cofre para a guarda destes itens. Os passeios, visitas, shows e restaurantes opcionais indicados nos pacotes
            de turismo ofertados pela BRT OPERADORA não estão incluídos no preço dos serviços, constituindo-se em mera
            sugestão e, se contratados diretamente com o prestador específico, não será de responsabilidade da BRT
            OPERADORA a operacionalização/realização bem como na garantia da qualidade desses produtos opcionais. A
            apresentação para o embarque nos meios de transporte adquiridos no pacote deverá seguir rigorosamente os
            horários determinados nos documentos entregues e informações repassadas pela AGÊNCIA.
          </p>
          <h4>CONDIÇÕES PARA TRANSPORTE AÉREO</h4>
          <p>
            O bilhete de passagem aérea representa o contrato de transporte aéreo estabelecido entre o passageiro e a
            companhia aérea, o qual é regido por normas internacionais (Convenção de Varsóvia) e pelo Código Brasileiro
            de Aeronáutica, sendo a BRT OPERADORA estranha a essa relação. O transporte de bagagens será feito de acordo
            com os critérios definidos por cada companhia aérea, e sob exclusiva responsabilidade desta, nos termos da
            legislação específica. O peso, volume e dimensão da bagagem, bem como a quantidade de peças são determinados
            pela legislação específica. Sugere-se que, antes de viajar, o passageiro verifique com a companhia aérea os
            volumes permitidos, bem como as sobretaxas cobradas no caso de excesso de bagagem. Os volumes excedentes
            estarão sujeitos à cobrança de sobretaxas, definidas exclusivamente pela companhia aérea transportadora. No
            caso de atraso e cancelamento de voo, acidentes, perda ou extravio de bagagens, a responsabilidade será
            exclusiva da companhia aérea contratada, observadas as normas internacionais e nacionais. A companhia aérea
            é responsável pelos danos causados a pessoas ou bagagens, nos termos da Lei nº 7.565/86, e outros
            dispositivos legais aplicáveis. A necessidade de realização de escalas técnicas, mesmo que não previstas na
            contratação do serviço de transporte aéreo, fica a critério exclusivo da companhia aérea, e sob exclusiva
            responsabilidade desta. O preço de tarifas aéreas descrito nas divulgações promocionais não vincula a BRT
            OPERADORA, podendo ser reajustado por determinação da companhia aérea, de acordo com as resoluções da
            Associação Internacional de Transportes Aéreos (IATA) e da Agência Nacional de Aviação Civil (ANAC). A
            apresentação para embarque nos aeroportos deve ocorrer em consonância com as instruções das companhias
            aéreas que serão informadas pela AGÊNCIA diretamente ao CONTRATANTE, sendo de responsabilidade deste e/ou
            passageiros observá-las. Recomenda-se, contudo, o seguinte: Apresentar-se para voos internacionais com
            antecedência mínima de 03 (três) horas do horário previsto para o horário de embarque; Apresentar-se, para
            voos nacionais, com a antecedência exigida pela companhia aérea responsável; Confirmar, diretamente na
            companhia aérea, cada voo subsequente, com antecedência mínima de 72 (setenta e duas) horas da saída do voo.
            As companhias aéreas não aguardarão passageiros que forem retidos para fiscalização, por autoridades
            fiscais, aduaneiras ou policiais. O não embarque, nessas hipóteses caracterizará o cancelamento da viagem
            com aplicação das penalidades previstas no item 3 deste documento, que trata dos cancelamentos.
          </p>
          <h4>CONDIÇÕES PARA LOCAÇÃO DE CARRO</h4>
          <p>
            Nas locações nacionais, somente será locado o carro para motoristas habilitados por mais de dois anos. Não é
            permitida a utilização de permissão para dirigir um carro alugado. Somente motoristas maiores de 21 (vinte e
            um) anos podem alugar um automóvel. Em outros países, além desses documentos, é exigida carteira de
            habilitação internacional. A idade mínima para locação de carro no exterior varia de 21 a 25 anos de idade
            (há locadoras que cobram taxas para motoristas menores de 25 anos e que devem ser pagas na localidade) para
            motoristas, essa informação deve ser verificada diretamente com a locadora do veículo. A apresentação de uma
            carteira internacional de habilitação é fortemente recomendada e pode ser obrigatória em alguns países. O
            CONTRATANTE deve se informar respeito antes de iniciar a viagem. É necessária apresentação de cartão de
            crédito com limite mínimo exigido pela locadora, quando será feita um pré-autorização de débito, para cobrir
            eventuais danos ou avarias que o carro possa sofrer. Equipamentos adicionais (cadeirinha de bebê, GPS, entre
            outros) podem ser solicitados e serão pagos no local da retirada do veículo. As condições de entrega do
            veículo devem ser buscadas pelo CONTRATANTE, quando retirado da locadora.
          </p>
          <h4>EMISSÃO DE DOCUMENTAÇÃO DA VIAGEM</h4>
          <p>
            A BRT OPERADORA providenciará a emissão da documentação da viagem no prazo mínimo de 72 (setenta e duas)
            horas após o efetivo pagamento do valor total do pacote de turismo. A documentação da viagem para voos
            fretados e voos regulares em sistema de bloqueio (tarifa operador) será entregue no prazo máximo de 48
            (quarenta e oito) horas antes do embarque. Em caso de reserva realizada dentro do período de 7 (sete) dias
            que antecede a viagem, a BRT OPERADORA reserva-se o direto de entregar a documentação da viagem diretamente
            no aeroporto.
          </p>
          <h4>RESPONSABILIDADE DO CONTRATANTE</h4>
          <p>
            É de responsabilidade exclusiva do CONTRATANTE providenciar os documentos necessários para a viagem, tais
            como: documentos pessoais, vistos, vacinas, passaportes, etc. Para embarque de menores é necessário que eles
            estejam acompanhados dos seus pais ou responsável legal. Em caso de o menor viajar somente com um dos pais
            ou sozinho, é necessária autorização conforme os requisitos exigidos pela Polícia Federal e demais órgãos
            responsáveis. Para hospedagem, nos estabelecimentos brasileiros o menor de 18 (dezoito) anos é necessária
            autorização conforme os requisitos exigidos pela Polícia Federal e demais órgãos responsáveis. O CONTRATANTE
            se responsabiliza pela busca das informações adequadas aos procedimentos momento da contratação e viagem. A
            impossibilidade de embarque ocorridas em decorrência da recusa de vistos, ou por falta de qualquer
            documentação exigida, não gera o direito de restituição ou indenização pelo CONTRATANTE dos valores pagos
            pela contratação da viagem frustrada. A impossibilidade ou proibição de entrada em um determinado país não
            gera para o CONTRATANTE e/ou passageiro(s) o direito à restituição dos valores despendidos ou qualquer outro
            tipo de indenização. O CONTRATANTE declara que lhe foi oferecido serviço de assistência de viagem (seguro
            viagem) e que, caso não tenha adquirido, isenta expressamente a AGÊNCIA e a BRT OPERADORA de qualquer
            responsabilidade que lhes possa ser atribuída em decorrência da falta deste serviço. É, ainda, de
            responsabilidade do CONTRATANTE: Pagar o preço previsto para a viagem ou excursão na forma acordada e
            ofertada no pacote de turismo; Cumprir os horários e procedimentos estabelecidos no programa e em suas
            eventuais alterações, previstas na descrição dos serviços; Informar a AGÊNCIA no ato de sua inscrição no
            programa sobre qualquer restrição ou impedimento, seu ou de seus familiares e/ou acompanhantes, decorrente
            de motivo de doença, necessidades especiais, ou outra causa qualquer que demande tratamento diferenciado
            para o desenvolvimento da excursão; Preservar e conservar as áreas, instalações e equipamentos que sejam
            postos a sua disposição durante a viagem ou programação turística; Arcar com perdas e danos decorrentes de
            ações ou omissões que ocasionarem danos decorrentes de seus atos, independentemente de culpa ou dolo; A
            busca sobre as normas legais e costumes locais e a sua obediência, de forma que será unicamente responsável,
            caso desobedeça tais preceitos ou perturbe a ordem moral e os bons costumes do local.
          </p>
          <h4>RECLAMAÇÕES</h4>
          <p>
            Eventuais reclamações sobre a prestação dos serviços deverão ser encaminhadas, por escrito, via e-mail, ou
            diretamente à BRT OPERADORA, localizada na Rua Presidente Faria, nº 321, Centro, Curitiba- PR, CEP
            80020-290, no prazo de até 30 (trinta) dias após o término da prestação, conforme prescreve o artigo 26,1, §
            1o, da Lei 8.078/90 (Código de Defesa do Consumidor).
          </p>
          <h4>DISPOSIÇÕES FINAIS</h4>
          <p>
            A AGÊNCIA é a única e exclusiva responsável pela emissão da(s) nota(s) fiscal(is) referente às comissões
            pagas pela BRT OPERADORA. As condições gerais aqui especificadas são firmadas entre a BRT OPERADORA, a
            AGÊNCIA e o CONTRATANTE. AGÊNCIA é responsável por transmitir as condições específicas de cada produto ao
            CONTRATANTE e passageiros. FORO. Fica eleito o foro central da comarca da região metropolitana de Curitiba,
            Estado do Paraná, para dirimir eventuais questões oriundas do presente instrumento ou da relação jurídica
            entabulada entre as Partes, que não possam ser solucionadas amigavelmente ou administrativamente,
            renunciando-se qualquer outro por mais privilegiado que possa ser. Este documento está registrado no 4º
            Ofício de Registro de Títulos e Documentos de Curitiba, sob número 572.272.
          </p>
          <p>Curitiba, 14 de outubro de 2016.</p>
        </div>
      </section>
    </section>
  </Transition>
  <section
    @click="closeSidebar()"
    class="bg-sidebar"
    :class="promoStore.sideBarOpen || bookingStore.sideBarOpen ? 'active' : ''"
  ></section>
  <slot />
</template>

<style scoped>
h4 {
  @apply font-bold;
}
.container-general-terms {
  @apply flex flex-col gap-2 mr-4 text-xs;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(500px);
}

.sidebar {
  height: 100%;
  z-index: 99;
}

.bg-sidebar {
  width: 100vw;
  height: 100vh;
  transition: opacity 0.3s;
  background-color: rgb(0, 0, 0);
  position: fixed;
  opacity: 0;
  z-index: 98;
  pointer-events: none;
}
.bg-sidebar.active {
  opacity: 0.5;
  pointer-events: auto;
}

.customer-logo {
  @apply w-32 md:w-40;
}
.title-sidebar {
  @apply flex justify-between items-center w-full;
}
</style>
