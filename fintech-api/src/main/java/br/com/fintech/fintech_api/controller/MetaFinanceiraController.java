package br.com.fintech.fintech_api.controller;

import br.com.fintech.fintech_api.model.MetaFinanceira;
import br.com.fintech.fintech_api.service.MetaFinanceiraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/metas")
public class MetaFinanceiraController {

    private final MetaFinanceiraService metaFinanceiraService;

    public MetaFinanceiraController(MetaFinanceiraService metaFinanceiraService) {
        this.metaFinanceiraService = metaFinanceiraService;
    }

    @GetMapping
    public ResponseEntity<List<MetaFinanceira>> listarTodos() {
        return ResponseEntity.ok(metaFinanceiraService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetaFinanceira> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(metaFinanceiraService.buscarPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MetaFinanceira>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(metaFinanceiraService.listarPorUsuario(idUsuario));
    }

    @PostMapping
    public ResponseEntity<MetaFinanceira> salvar(@Valid @RequestBody MetaFinanceira meta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(metaFinanceiraService.salvar(meta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetaFinanceira> atualizar(@PathVariable Long id,
                                                    @Valid @RequestBody MetaFinanceira meta) {
        return ResponseEntity.ok(metaFinanceiraService.atualizar(id, meta));
    }

    @PatchMapping("/{id}/progresso")
    public ResponseEntity<MetaFinanceira> adicionarProgresso(@PathVariable Long id,
                                                             @RequestBody BigDecimal valor) {
        return ResponseEntity.ok(metaFinanceiraService.adicionarProgresso(id, valor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long idUsuario) {
        metaFinanceiraService.deletar(id, idUsuario);
        return ResponseEntity.noContent().build();
    }
}