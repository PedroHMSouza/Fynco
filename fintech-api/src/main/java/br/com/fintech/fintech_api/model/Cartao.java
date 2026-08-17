package br.com.fintech.fintech_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "CARTAO")
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_id_cartao")
    @SequenceGenerator(name = "seq_id_cartao", sequenceName = "SEQ_ID_CARTAO", allocationSize = 1)
    @Column(name = "ID_CARTAO")
    private Long idCartao;

    @NotNull(message = "Conta é obrigatória")
    @ManyToOne
    @JoinColumn(name = "ID_CONTA", nullable = false)
    private Conta conta;

    @NotBlank(message = "Tipo do cartão é obrigatório")
    @Size(max = 20)
    @Column(name = "TIPO_CARTAO", length = 20)
    private String tipoCartao;

    @NotBlank(message = "Bandeira é obrigatória")
    @Size(max = 30)
    @Column(name = "BANDEIRA", length = 30)
    private String bandeira;

    @NotNull(message = "Limite é obrigatório")
    @Positive(message = "Limite deve ser maior que zero")
    @Column(name = "LIMITE", precision = 10, scale = 2)
    private BigDecimal limite;

    @Column(name = "FECHAMENTO_FATURA")
    private LocalDate fechamentoFatura;

    @Column(name = "DATA_ATUALIZACAO")
    private LocalDate dataAtualizacao;

    @PrePersist
    public void prePersist() {
        if (dataAtualizacao == null) {
            dataAtualizacao = LocalDate.now();
        }
    }

    public Cartao() {}

    public Long getIdCartao() { return idCartao; }
    public void setIdCartao(Long idCartao) { this.idCartao = idCartao; }

    public Conta getConta() { return conta; }
    public void setConta(Conta conta) { this.conta = conta; }

    public String getTipoCartao() { return tipoCartao; }
    public void setTipoCartao(String tipoCartao) { this.tipoCartao = tipoCartao; }

    public String getBandeira() { return bandeira; }
    public void setBandeira(String bandeira) { this.bandeira = bandeira; }

    public BigDecimal getLimite() { return limite; }
    public void setLimite(BigDecimal limite) { this.limite = limite; }

    public LocalDate getFechamentoFatura() { return fechamentoFatura; }
    public void setFechamentoFatura(LocalDate fechamentoFatura) { this.fechamentoFatura = fechamentoFatura; }

    public LocalDate getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDate dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}