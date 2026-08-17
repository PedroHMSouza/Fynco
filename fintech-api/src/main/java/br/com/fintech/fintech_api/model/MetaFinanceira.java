package br.com.fintech.fintech_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "META_FINANCEIRA")
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_id_meta")
    @SequenceGenerator(name = "seq_id_meta", sequenceName = "SEQ_ID_META", allocationSize = 1)
    @Column(name = "ID_META")
    private Long idMeta;

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

    @NotBlank(message = "Descrição da meta é obrigatória")
    @Size(max = 255)
    @Column(name = "DESCRICAO_META", length = 255)
    private String descricaoMeta;

    @NotNull(message = "Valor objetivo é obrigatório")
    @Positive(message = "Valor objetivo deve ser maior que zero")
    @Column(name = "VALOR_OBJETIVO", precision = 10, scale = 2)
    private BigDecimal valorObjetivo;

    @PositiveOrZero(message = "Valor atual deve ser zero ou positivo")
    @Column(name = "VALOR_ATUAL", precision = 10, scale = 2)
    private BigDecimal valorAtual = BigDecimal.ZERO;

    @NotNull(message = "Data de início é obrigatória")
    @Column(name = "DATA_INICIO", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "DATA_FIM")
    private LocalDate dataFim;

    public MetaFinanceira() {}

    public Long getIdMeta() { return idMeta; }
    public void setIdMeta(Long idMeta) { this.idMeta = idMeta; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getDescricaoMeta() { return descricaoMeta; }
    public void setDescricaoMeta(String descricaoMeta) { this.descricaoMeta = descricaoMeta; }

    public BigDecimal getValorObjetivo() { return valorObjetivo; }
    public void setValorObjetivo(BigDecimal valorObjetivo) { this.valorObjetivo = valorObjetivo; }

    public BigDecimal getValorAtual() { return valorAtual; }
    public void setValorAtual(BigDecimal valorAtual) { this.valorAtual = valorAtual; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
}