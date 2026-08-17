package br.com.fintech.fintech_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "INVESTIMENTO")
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_id_investimento")
    @SequenceGenerator(name = "seq_id_investimento", sequenceName = "SEQ_ID_INVESTIMENTO", allocationSize = 1)
    @Column(name = "ID_INVESTIMENTO")
    private Long idInvestimento;

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

    @NotBlank(message = "Tipo é obrigatório")
    @Size(max = 100)
    @Column(name = "TIPO", nullable = false, length = 100)
    private String tipo;

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser maior que zero")
    @Column(name = "VALOR", nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @NotNull(message = "Taxa é obrigatória")
    @PositiveOrZero(message = "Taxa deve ser zero ou positiva")
    @Column(name = "TAXA", nullable = false, precision = 8, scale = 4)
    private BigDecimal taxa;

    @NotNull(message = "Data do investimento é obrigatória")
    @Column(name = "DATA_INVESTIMENTO", nullable = false)
    private LocalDate dataInvestimento;

    public Investimento() {}

    public Long getIdInvestimento() { return idInvestimento; }
    public void setIdInvestimento(Long idInvestimento) { this.idInvestimento = idInvestimento; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public BigDecimal getTaxa() { return taxa; }
    public void setTaxa(BigDecimal taxa) { this.taxa = taxa; }

    public LocalDate getDataInvestimento() { return dataInvestimento; }
    public void setDataInvestimento(LocalDate dataInvestimento) { this.dataInvestimento = dataInvestimento; }
}