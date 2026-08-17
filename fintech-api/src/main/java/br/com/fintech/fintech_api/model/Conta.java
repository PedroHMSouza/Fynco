package br.com.fintech.fintech_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "CONTA")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_id_conta")
    @SequenceGenerator(name = "seq_id_conta", sequenceName = "SEQ_ID_CONTA", allocationSize = 1)
    @Column(name = "ID_CONTA")
    private Long idConta;

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

    @NotBlank(message = "Banco é obrigatório")
    @Size(max = 100)
    @Column(name = "BANCO", length = 100)
    private String banco;

    @NotBlank(message = "Tipo de conta é obrigatório")
    @Pattern(regexp = "CORRENTE|POUPANCA|INVESTIMENTO|DIGITAL",
            message = "Tipo deve ser CORRENTE, POUPANCA, INVESTIMENTO ou DIGITAL")
    @Column(name = "TIPO_CONTA", length = 50)
    private String tipoConta;

    @NotNull(message = "Saldo inicial é obrigatório")
    @Column(name = "SALDO_INICIAL", precision = 10, scale = 2)
    private BigDecimal saldoInicial;

    @NotNull(message = "Saldo atual é obrigatório")
    @Column(name = "SALDO_ATUAL", nullable = false, precision = 15, scale = 2)
    private BigDecimal saldoAtual;

    @NotBlank(message = "Nome da conta é obrigatório")
    @Size(max = 100)
    @Column(name = "NOME_CONTA", nullable = false, length = 100)
    private String nomeConta;

    public Conta() {}

    public Long getIdConta() { return idConta; }
    public void setIdConta(Long idConta) { this.idConta = idConta; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getBanco() { return banco; }
    public void setBanco(String banco) { this.banco = banco; }

    public String getTipoConta() { return tipoConta; }
    public void setTipoConta(String tipoConta) { this.tipoConta = tipoConta; }

    public BigDecimal getSaldoInicial() { return saldoInicial; }
    public void setSaldoInicial(BigDecimal saldoInicial) { this.saldoInicial = saldoInicial; }

    public BigDecimal getSaldoAtual() { return saldoAtual; }
    public void setSaldoAtual(BigDecimal saldoAtual) { this.saldoAtual = saldoAtual; }

    public String getNomeConta() { return nomeConta; }
    public void setNomeConta(String nomeConta) { this.nomeConta = nomeConta; }
}