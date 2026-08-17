package br.com.fintech.fintech_api.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "CATEGORIA")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_id_categoria")
    @SequenceGenerator(name = "seq_id_categoria", sequenceName = "SEQ_ID_CATEGORIA", allocationSize = 1)
    @Column(name = "ID_CATEGORIA")
    private long idCategoria;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 50)
    @Column(name = "NOME", length = 50)
    private String nome;

    @NotBlank(message = "Tipo é obrigatório")
    @Pattern(regexp = "RECEITA|DESPESA", message = "Tipo deve ser RECEITA ou DESPESA")
    @Column(name = "TIPO", nullable = false, length = 20)
    private String tipo;

    public Categoria(){}

    public long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(long idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
